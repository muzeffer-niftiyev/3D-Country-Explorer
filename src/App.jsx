import Earth from "./components/Earth";
import { Html } from "@react-three/drei";
import Loader from "./components/Loader";
import Sidebar from "./components/Sidebar";
import { Canvas } from "@react-three/fiber";
import ThemeToggle from "./components/ThemeToggle";
import { Suspense, useEffect, useRef, useState } from "react";
import ToastProvider from "./components/ToastProvider";
import Sun from "./components/Sun";

const App = () => {
  const earthMaterialRef = useRef();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1100);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isSmallScreen) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-center bg-[#0f0f16] text-[#eee] text-xl p-4">
        Please use a larger screen to access this website.
      </div>
    );
  }

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
                <Loader color="text-[#eee]" />
              </Html>
            }
          >
            <Sun earthMaterialRef={earthMaterialRef} />
            <Earth earthMaterialRef={earthMaterialRef} />
          </Suspense>
        </Canvas>
      </div>
      <ToastProvider />
    </div>
  );
};

export default App;
