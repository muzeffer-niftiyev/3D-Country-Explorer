import { Canvas } from "@react-three/fiber";
import Earth from "./components/Earth";
import Sidebar from "./components/Sidebar";
import { Suspense } from "react";
import { Html } from "@react-three/drei";
import Loader from "./components/Loader";

const App = () => {
  return (
    <div className="flex">
      <div className="w-[30dvw] h-[100dvh] py-8 pl-8 bg-[#0f0f16]">
        <Sidebar />
      </div>
      <div className="w-[70dvw] h-[100dvh]">
        <Canvas
          flat
          camera={{
            fov: 30,
            near: 0.1,
            far: 200,
          }}
          gl={{ preserveDrawingBuffer: true }}
        >
          <color args={["#0f0f16"]} attach={"background"} />
          <Suspense fallback={<Loader />}>
            <Earth />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;

// TODO

// GECE GUNDUZ CEVIRMEK ELAVE ELEMEK
// TEXTURE SEKLI DEYISECEK
