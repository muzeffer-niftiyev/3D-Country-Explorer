import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {  useRef } from "react";

import * as THREE from "three";

const Sun = ({ earthMaterialRef }) => {
  const sunRef = useRef()
  const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
  const sunDirection = new THREE.Vector3();

  useFrame(() => {
    if (!sunRef.current) return;
    sunDirection.setFromSpherical(sunSpherical);
    sunRef.current.position.copy(sunDirection).multiplyScalar(5);
    sunSpherical.theta += 0.01;
    earthMaterialRef.current.uniforms.uSunDirection.value.copy(sunDirection);
  });

  return (
    <Sphere args={[0.1, 32, 32]} ref={sunRef}>
      <meshBasicMaterial />
    </Sphere>
  );
};

export default Sun;
