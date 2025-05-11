import { useEffect, useRef, useState } from "react";
import { OrbitControls, Sphere } from "@react-three/drei";
import EarthTexture from "../assets/earthTexture.png";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { getCountryCodeFromEarth } from "../services/services";
import gsap from "gsap";

const Earth = () => {
  const texture = useLoader(TextureLoader, EarthTexture);
  const earthRef = useRef();
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

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

  const handleEarthClick = async (event) => {
    const mouse = new THREE.Vector2();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(earthRef.current, true);

    if (intersects.length > 0) {
      const point = intersects[0].point.clone().normalize().multiplyScalar(2.5);

      gsap.to(camera.position, {
        x: point.x,
        y: point.y,
        z: point.z,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          controlsRef.current.update();
          const distance = camera.position.distanceTo(
            earthRef.current.position
          );
          controlsRef.current.maxDistance = distance * 2;
        },
      });

      const { lat, lng } = getLatLngfromEarth(point.clone().normalize());
      try {
        const countryCode = await getCountryCodeFromEarth(lat, lng);
        if (countryCode) {
          setSelectedCountryCode(countryCode);
        } else {
          console.log("Error setting country code");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (selectedCountryCode) {
      console.log("Selected:", selectedCountryCode);
    }
  }, [selectedCountryCode]);

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
          if (!isDragging) {
            handleEarthClick(event);
          }
        }}
      >
        <meshStandardMaterial
          map={texture}
          depthTest={true}
          depthWrite={true}
        />
      </Sphere>
    </>
  );
};

export default Earth;
