import { useRef, useState } from "react";
import { OrbitControls, Sphere } from "@react-three/drei";
import EarthTexture from "../assets/earthTexture.png";
import * as THREE from "three";
import { Center } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { getCountryNameFromLatLng } from "../services/services";

const Earth = () => {
  const texture = useLoader(TextureLoader, EarthTexture);
  const earthRef = useRef();
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

  const handleEarthClick = (event) => {
    const mouse = new THREE.Vector2();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.params.Mesh = { threshold: 0.05 };
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earthRef.current, true);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const normalized = point.clone().normalize();
      const { lat, lng } = getLatLngfromEarth(normalized);
      getCountryNameFromLatLng(lat, lng);
    }
  };

  return (
    <>
      <color args={["#0f0f16"]} attach={"background"} />
      <OrbitControls
        makeDefault
        rotateSpeed={0.4}
        maxDistance={Math.PI * 1.5}
        minDistance={Math.PI / 1.5}
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
