import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useMemo, useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { Sphere, OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import {
  getCountryCodeFromEarth,
  getCountryDataFromCode,
} from "../services/services";
import { setIsLoading, setSelectedCountryData } from "../store/countrySlice";

const Earth = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  const [lightTexture, darkTexture] = useLoader(TextureLoader, [
    "/lightTexture.jpg",
    "/darkTexture.jpg",
  ]);
  const texture = useMemo(
    () => (theme === "dark" ? darkTexture : lightTexture),
    [theme, lightTexture, darkTexture]
  );
  const isCountryChanged = useSelector(
    (state) => state.country.isCountryChanged
  );
  const flyCoordinates = useSelector((state) => state.country.flyCoordinates);
  const earthRef = useRef();
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);

  const getLatLngfromEarth = (vector) => {
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
    navigate("country-details");

    const mouse = new THREE.Vector2();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(earthRef.current, true);
    if (intersects.length > 0) {
      const point = intersects[0].point.clone().normalize().multiplyScalar(2.5);
      flyTo(...Object.values(getLatLngfromEarth(point.clone().normalize())));
      const { lat, lng } = getLatLngfromEarth(point.clone().normalize());

      try {
        dispatch(setIsLoading(true));
        const countryCode = await getCountryCodeFromEarth(lat, lng);
        if (countryCode) {
          const countryData = await getCountryDataFromCode(countryCode);
          dispatch(setSelectedCountryData(countryData));
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    }
  };

  useEffect(() => {
    if (flyCoordinates.lat && flyCoordinates.lng) {
      flyTo(flyCoordinates.lat, flyCoordinates.lng);
    }
  }, [isCountryChanged, flyCoordinates]);

  return (
    <>
      <color attach="background" args={["#0f0f16"]} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        makeDefault
        rotateSpeed={0.4}
        maxDistance={Math.PI * 1.5}
        minDistance={Math.PI / 1.5}
        enableDamping
        dampingFactor={0.1}
      />
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Sphere
        args={[1, 32, 32]}
        ref={earthRef}
        onPointerDown={() => setIsDragging(false)}
        onPointerMove={() => setIsDragging(true)}
        onPointerUp={(event) => {
          if (!isDragging) handleEarthClick(event);
        }}
      >
        <meshStandardMaterial
          map={texture}
          depthTest={true}
          depthWrite={true}
          opacity={1}
        />
      </Sphere>
    </>
  );
};

export default Earth;
