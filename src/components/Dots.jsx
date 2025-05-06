import { Sphere, Html } from "@react-three/drei";
import { useState } from "react";

const Dots = ({ country, onClick, earthRef }) => {
  const [isHovered, setIsHovered] = useState(false);

  const latLngTo3D = (lat, lng) => {
    const radius = 1;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return { x, y, z };
  };

  const { x, y, z } = latLngTo3D(country.lat, country.lng);
  return (
    <Html args={[0.01, 8, 8]} position={[x, y, z]} occlude={[earthRef]}>
      <button
        onClick={onClick}
        className="relative w-5 h-5 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="absolute inset-0 rounded-full ring-2 ring-[#fcf6f6] animate-ping" />
        <div className="w-full h-full rounded-full bg-[#fcf6f6] z-10 relative opacity-[.7]"></div>
      </button>

      {isHovered && <div>HOVER</div>}
    </Html>
  );
};

export default Dots;
