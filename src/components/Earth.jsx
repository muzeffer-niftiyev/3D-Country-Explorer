import { Suspense, useEffect, useRef, useState } from "react";
import { OrbitControls, Sphere } from "@react-three/drei";
import EarthTexture from "../assets/earthTexture.png";
import * as THREE from "three";
import { Center } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import Dots from "./Dots";

// Sample country coordinates (this can be dynamically fetched from an API)
const availableCountries = [
  { name: "USA", lat: 37.0902, lng: -95.7129 },
  { name: "India", lat: 20.5937, lng: 78.9629 },
  { name: "Australia", lat: -25.2744, lng: 133.7751 },
  { name: "Brazil", lat: -14.235, lng: -51.9253 },
  { name: "Canada", lat: 45.4215, lng: -75.6971 },
  // Add more countries with lat/lng
];

const Earth = () => {
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [countryData, setCountryData] = useState(null);
  const texture = useLoader(TextureLoader, EarthTexture);
  const earthRef = useRef();

  const getCountryData = async (lat, lng) => {
    try {
      if (!coordinates) return;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      setCountryData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDotClick = (lat, lng) => {
    setCoordinates({ lat, lng });
    getCountryData(lat, lng);
  };

  useEffect(() => {
    console.log(countryData);
  }, [countryData]);

  return (
    <Suspense fallback={"Loading..."}>
      <color args={["#0f0f16"]} attach={"background"} />
      <OrbitControls
        makeDefault
        rotateSpeed={0.4}
        maxDistance={Math.PI * 1.5}
        minDistance={Math.PI / 1.5}
      />
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      <Center>
        <Sphere args={[1, 32, 32]} ref={earthRef}>
          <meshStandardMaterial map={texture} />
        </Sphere>
      </Center>
      {availableCountries.map((country, index) => (
        <Dots country={country} key={index} earthRef={earthRef} onClick={handleDotClick} />
      ))}
    </Suspense>
  );
};

export default Earth;
