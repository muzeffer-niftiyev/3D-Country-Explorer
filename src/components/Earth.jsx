import gsap from "gsap";
import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";
import { useDispatch, useSelector } from "react-redux";
import { useFrame, useThree } from "@react-three/fiber";
import { useLocation, useNavigate } from "react-router-dom";
import { getCountryCodeFromEarth } from "../services/services";
import { useEarthTextures } from "../hooks/useEarthTextures";
import { useRef, useState, useEffect, useMemo } from "react";
import { useCountryHighlight } from "../hooks/useCountryHighlight";
import { Sphere, OrbitControls, Html, Line } from "@react-three/drei";
import { setIsLoading, setSelectedCountryData } from "../store/countrySlice";
import { showFetchError, useSelectCountry } from "../hooks/useCountrySelection";

const Earth = ({ earthMaterialRef, onFirstFrame }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectCountry = useSelectCountry();
  const highlightedCode = useSelector((state) => state.country.highlightedCode);
  const isCountryChanged = useSelector(
    (state) => state.country.isCountryChanged
  );
  const earthRef = useRef();

  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const pointerDownPos = useRef(null);
  const TAP_THRESHOLD_PX = 8;
  const [pinPosition, setPinPosition] = useState(null);
  const flyCoordinates = useSelector((state) => state.country.flyCoordinates);
  const {
    day: earthLightTexture,
    night: earthDarkTexture,
    specular: earthSpecularTexture,
  } = useEarthTextures();

  const hasRenderedRef = useRef(false);
  useFrame(() => {
    if (hasRenderedRef.current) return;
    hasRenderedRef.current = true;
    requestAnimationFrame(() => onFirstFrame?.());
  });

  const getLatLngFromEarth = (vector) => {
    const lat = 90 - (Math.acos(vector.y) * 180) / Math.PI;
    const lng = -(
      (((Math.atan2(vector.z, vector.x) * 180) / Math.PI + 180) % 360) -
      180
    );
    return {
      lat: Math.round(lat * 100) / 100,
      lng: Math.round(lng * 100) / 100,
    };
  };

  const getVectorFromLatLng = (lat, lng, radius = 2.5) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  const flyTo = (lat, lng) => {
    const point = getVectorFromLatLng(lat, lng);
    gsap.to(camera.position, {
      x: point.x,
      y: point.y,
      z: point.z,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
        controlsRef.current.update();
        const distance = camera.position.distanceTo(earthRef.current.position);
        controlsRef.current.maxDistance = distance * 2;
      },
    });
  };

  const handleEarthClick = async (event) => {
    if (location.pathname.startsWith("/quiz")) return;
    const mouse = new THREE.Vector2();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(earthRef.current, true);
    if (intersects.length > 0) {
      const point = intersects[0].point.clone().normalize().multiplyScalar(2.5);
      const { lat, lng } = getLatLngFromEarth(point.clone().normalize());
      flyTo(lat, lng);
      setPinPosition(getVectorFromLatLng(lat, lng, 1));
      dispatch(setIsLoading(true));
      let countryCode;
      try {
        countryCode = await getCountryCodeFromEarth(lat, lng);
      } catch (error) {
        showFetchError(error, "Couldn't find a country there.");
        dispatch(setSelectedCountryData({}));
        dispatch(setIsLoading(false));
        navigate("/country-details");
        return;
      }
      await selectCountry(countryCode, { fly: false });
    }
  };

  useEffect(() => {
    if (flyCoordinates.lat && flyCoordinates.lng) {
      const pos = getVectorFromLatLng(
        flyCoordinates.lat,
        flyCoordinates.lng,
        1
      );
      setPinPosition(pos);
      flyTo(flyCoordinates.lat, flyCoordinates.lng);
    }
  }, [isCountryChanged, flyCoordinates]);

  const uniforms = useMemo(
    () => ({
      uLightTexture: new THREE.Uniform(earthLightTexture),
      uDarkTexture: new THREE.Uniform(earthDarkTexture),
      uSpecularTexture: new THREE.Uniform(earthSpecularTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
      uAtmosphereLightColor: new THREE.Uniform(new THREE.Color("#0a96db")),
      uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color("#bd5611")),
      uHighlightTexture: new THREE.Uniform(null),
      uHighlightStrength: new THREE.Uniform(0),
      uHighlightColor: new THREE.Uniform(new THREE.Color("#ffc45c")),
    }),
    []
  );

  const outline = useCountryHighlight(highlightedCode, uniforms);
  const outlineRef = useRef();
  useEffect(() => {
    const material = outlineRef.current?.material;
    if (!material) return;
    gsap.fromTo(
      material,
      { opacity: 0 },
      { opacity: 0.95, duration: 0.8, ease: "power2.out" }
    );
  }, [outline]);

  return (
    <>
      <color attach="background" args={["#0f0f16"]} />
      <OrbitControls
        makeDefault
        ref={controlsRef}
        enablePan={false}
        rotateSpeed={0.5}
        enableDamping
        dampingFactor={0.1}
        minDistance={Math.PI / 1.5}
        maxDistance={Math.PI * 1.5}
      />
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Sphere
        args={[1, 128, 64]}
        ref={earthRef}
        onPointerDown={(event) => {
          pointerDownPos.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = pointerDownPos.current;
          pointerDownPos.current = null;
          if (!start) return;
          const moved = Math.hypot(
            event.clientX - start.x,
            event.clientY - start.y
          );
          if (moved < TAP_THRESHOLD_PX) handleEarthClick(event);
        }}
      >
        <shaderMaterial
          attach="material"
          ref={earthMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </Sphere>

      {outline && outline.length > 0 && (
        <Line
          ref={outlineRef}
          points={outline}
          segments
          color="#ffe2a8"
          lineWidth={1.6}
          transparent
          opacity={0}
        />
      )}

      {pinPosition && (
        <Html args={[0.01, 8, 8]} position={pinPosition} occlude={[earthRef]}>
          <button
            className="relative w-5 h-5 cursor-pointer transition-none"
            aria-hidden="true"
            tabIndex={-1}
          >
            <span className="absolute inset-0 rounded-full ring-2 ring-neutral-200 animate-ping" />
            <div className="w-full h-full rounded-full bg-neutral-200 z-10 relative opacity-[.7]"></div>
          </button>
        </Html>
      )}
    </>
  );
};

export default Earth;
