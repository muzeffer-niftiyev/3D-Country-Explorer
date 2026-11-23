import gsap from "gsap";
import * as THREE from "three";
import { feature } from "topojson-client";
import { useEffect, useMemo, useState } from "react";

const BORDERS_URL = "/data/country-borders-50m.json";
const MASK_WIDTH = 4096;
const MASK_HEIGHT = 2048;
const OUTLINE_RADIUS = 1.002;
const MAX_STEP_DEG = 1;

let bordersPromise = null;

const loadBorders = () => {
  if (!bordersPromise) {
    bordersPromise = fetch(BORDERS_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((topology) => {
        const byCode = new Map();
        const { features } = feature(topology, topology.objects.countries);
        for (const { id, geometry } of features) {
          if (!id || !geometry) continue;
          const polygons =
            geometry.type === "Polygon"
              ? [geometry.coordinates]
              : geometry.type === "MultiPolygon"
              ? geometry.coordinates
              : [];
          byCode.set(id, [...(byCode.get(id) || []), ...polygons]);
        }
        return byCode;
      })
      .catch((error) => {
        bordersPromise = null;
        throw error;
      });
  }
  return bordersPromise;
};

const useCountryBorders = () => {
  const [borders, setBorders] = useState(null);
  useEffect(() => {
    if (borders) return;
    let cancelled = false;
    loadBorders()
      .then((map) => !cancelled && setBorders(map))
      .catch((error) =>
        console.warn("Country borders failed to load.", error)
      );
    return () => {
      cancelled = true;
    };
  }, [borders]);
  return borders;
};

const unwrapRing = (ring) => {
  const out = [];
  let previous = null;
  for (const [lng, lat] of ring) {
    let x = lng;
    if (previous !== null) {
      while (x - previous > 180) x -= 360;
      while (x - previous < -180) x += 360;
    }
    out.push([x, lat]);
    previous = x;
  }
  return out;
};

const drawMask = (ctx, polygons) => {
  ctx.clearRect(0, 0, MASK_WIDTH, MASK_HEIGHT);
  if (!polygons) return;
  ctx.fillStyle = "#fff";
  const toX = (lng) => ((lng + 180) / 360) * MASK_WIDTH;
  const toY = (lat) => ((90 - lat) / 180) * MASK_HEIGHT;

  for (const polygon of polygons) {
    const rings = polygon.map(unwrapRing);
    for (const shift of [-360, 0, 360]) {
      ctx.beginPath();
      for (const ring of rings) {
        ring.forEach(([lng, lat], i) => {
          const x = toX(lng + shift);
          const y = toY(lat);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
      }
      ctx.fill("evenodd");
    }
  }
};

const toSphere = (lng, lat, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
};

const isOnDateLine = (lng) => Math.abs(Math.abs(lng) - 180) < 1e-6;

const buildOutline = (polygons) => {
  const points = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (let i = 1; i < ring.length; i++) {
        const [lng1, lat1] = ring[i - 1];
        const [lng2, lat2] = ring[i];
        if (isOnDateLine(lng1) && isOnDateLine(lng2)) continue;
        if (Math.abs(lng2 - lng1) > 180) continue;
        const steps = Math.max(
          1,
          Math.ceil(
            Math.max(Math.abs(lng2 - lng1), Math.abs(lat2 - lat1)) /
              MAX_STEP_DEG
          )
        );
        for (let s = 0; s < steps; s++) {
          const t1 = s / steps;
          const t2 = (s + 1) / steps;
          points.push(
            toSphere(lng1 + (lng2 - lng1) * t1, lat1 + (lat2 - lat1) * t1, OUTLINE_RADIUS),
            toSphere(lng1 + (lng2 - lng1) * t2, lat1 + (lat2 - lat1) * t2, OUTLINE_RADIUS)
          );
        }
      }
    }
  }
  return points;
};

export const useCountryHighlight = (code, uniforms) => {
  const borders = useCountryBorders();

  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = MASK_WIDTH;
    c.height = MASK_HEIGHT;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.NoColorSpace;
    return t;
  }, [canvas]);

  useEffect(() => {
    uniforms.uHighlightTexture.value = texture;
    return () => texture.dispose();
  }, [uniforms, texture]);

  const polygons = (code && borders?.get(code)) || null;
  const outline = useMemo(
    () => (polygons ? buildOutline(polygons) : null),
    [polygons]
  );

  useEffect(() => {
    drawMask(canvas.getContext("2d"), polygons);
    texture.needsUpdate = true;
    const strength = uniforms.uHighlightStrength;
    gsap.killTweensOf(strength);
    if (polygons) {
      gsap.fromTo(strength, { value: 0 }, { value: 1, duration: 0.8, ease: "power2.out" });
    } else {
      strength.value = 0;
    }
  }, [polygons, canvas, texture, uniforms]);

  return outline;
};
