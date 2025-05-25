import gsap from "gsap";
import {
  getCountryCodeFromEarth,
  getCountryDataFromCode,
} from "../services/services";
import * as THREE from "three";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoader, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import { Sphere, OrbitControls, Html } from "@react-three/drei";
import { setIsLoading, setSelectedCountryData } from "../store/countrySlice";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

const Earth = ({ earthMaterialRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCountryChanged = useSelector(
    (state) => state.country.isCountryChanged
  );
  const earthRef = useRef();

  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const [pinPosition, setPinPosition] = useState(null);
  const flyCoordinates = useSelector((state) => state.country.flyCoordinates);
  const earthLightTexture = useLoader(
    THREE.TextureLoader,
    "./lightTexture.jpg"
  );
  earthLightTexture.colorSpace = THREE.SRGBColorSpace;
  earthLightTexture.anisotropy = 8;
  const earthDarkTexture = useLoader(THREE.TextureLoader, "./darkTexture.jpg");
  earthDarkTexture.colorSpace = THREE.SRGBColorSpace;
  earthDarkTexture.anisotropy = 8;
  const earthSpecularTexture = useLoader(
    THREE.TextureLoader,
    "./specularTexture.jpg"
  );
  earthSpecularTexture.anisotropy = 8;

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
      const { lat, lng } = getLatLngFromEarth(point.clone().normalize());
      flyTo(lat, lng);
      setPinPosition(getVectorFromLatLng(lat, lng, 1));
      try {
        dispatch(setIsLoading(true));
        const countryCode = await getCountryCodeFromEarth(lat, lng);
        const countryData = await getCountryDataFromCode(countryCode);
        dispatch(setSelectedCountryData(countryData));
      } catch (error) {
        if (!navigator.onLine) {
          toast.error("No internet connection. Please check your network.");
        } else {
          toast.error(error.message);
        }
        dispatch(setSelectedCountryData({}));
      } finally {
        dispatch(setIsLoading(false));
      }
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
    }),
    []
  );

  return (
    <>
      <color attach="background" args={["#0f0f16"]} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        makeDefault
        rotateSpeed={0.4}
        // maxDistance={Math.PI * 1.5}
        // minDistance={Math.PI / 1.5}
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
        <shaderMaterial
          attach="material"
          ref={earthMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </Sphere>

      {pinPosition && (
        <Html args={[0.01, 8, 8]} position={pinPosition} occlude={[earthRef]}>
          <button className="relative w-5 h-5 cursor-pointer transition-none">
            <span className="absolute inset-0 rounded-full ring-2 ring-neutral-200 animate-ping" />
            <div className="w-full h-full rounded-full bg-neutral-200 z-10 relative opacity-[.7]"></div>
          </button>
        </Html>
      )}
    </>
  );
};

export default Earth;
