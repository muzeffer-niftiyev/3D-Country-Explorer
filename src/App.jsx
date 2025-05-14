import { Canvas } from "@react-three/fiber";
import Earth from "./components/Earth";
import Sidebar from "./components/Sidebar";
import { Suspense } from "react";
import Loader from "./components/Loader";
import { Html } from "@react-three/drei";
import ThemeToggle from "./components/ThemeToggle";
import PreloadTextures from "./components/PreloadTextures";

const App = () => {
  return (
    <div className="flex">
      <div className="w-[35dvw] h-[100dvh] py-8 pl-8">
        <Sidebar />
      </div>
      <div className="w-[65dvw] h-[100dvh] relative">
        <ThemeToggle />
        <Canvas
          flat
          camera={{
            fov: 30,
            near: 0.1,
            far: 200,
          }}
          dpr={1}
          gl={{ preserveDrawingBuffer: true }}
        >
          <color args={["#0f0f16"]} attach={"background"} />
          <Suspense
            fallback={
              <Html>
                <Loader />
              </Html>
            }
          >
            <PreloadTextures />
            <Earth />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;

// TODO

// 1) Select-den olke secildikde loader gorunmur. Loading olmasini yoxlayib loader gostermek lazmdi
