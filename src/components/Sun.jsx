import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

const Sun = ({ earthMaterialRef }) => {
  const sunRef = useRef();
  const { scene } = useThree();
  const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
  const sunDirection = new THREE.Vector3();
  const lensflare1 = useLoader(THREE.TextureLoader, "./lensflare1.png");
  lensflare1.colorSpace = THREE.SRGBColorSpace;
  const lensflare2 = useLoader(THREE.TextureLoader, "./lensflare2.png");
  lensflare2.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (!sunRef.current) return;
    sunDirection.setFromSpherical(sunSpherical);
    sunRef.current.position.copy(sunDirection).multiplyScalar(5);
    sunSpherical.theta += 0.01;
    earthMaterialRef.current.uniforms.uSunDirection.value.copy(sunDirection);
  });

  useEffect(() => {
    if (!sunRef.current) return;
    const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
    light.position.set(0, 0, 0);

    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(lensflare1, 1000, 0));
    lensflare.addElement(new LensflareElement(lensflare2, 70, 0.6));
    lensflare.addElement(new LensflareElement(lensflare2, 100, 0.7));
    lensflare.addElement(new LensflareElement(lensflare2, 150, 0.9));
    lensflare.addElement(new LensflareElement(lensflare2, 100, 1));
    light.add(lensflare);

    sunRef.current.add(light);
    scene.add(sunRef.current);
  }, [lensflare1, lensflare2, scene]);

  return <group ref={sunRef} />;
};

export default Sun;
