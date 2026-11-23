import Sun from "./components/Sun";
import Earth from "./components/Earth";
import Sidebar from "./components/Sidebar";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useRef, useState } from "react";
import IntroLoader from "./components/IntroLoader";
import GlobeErrorBoundary from "./components/GlobeErrorBoundary";
import ThemeToggle from "./components/ThemeToggle";
import ToastProvider from "./components/ToastProvider";
import { useLoadCountryList } from "./hooks/useCountrySelection";

const hasWebGL = (() => {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
})();

const App = () => {
  const earthMaterialRef = useRef();
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isGlobeFailed, setIsGlobeFailed] = useState(false);

  useLoadCountryList();

  const handleFirstFrame = useCallback(() => setIsGlobeReady(true), []);
  const handleGlobeError = useCallback(() => setIsGlobeFailed(true), []);

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] overflow-hidden">
      <IntroLoader isReady={isGlobeReady || isGlobeFailed || !hasWebGL} />

      <div className="order-2 lg:order-1 flex-1 min-h-0 lg:flex-none lg:w-[35%] lg:h-full p-3 sm:p-4 lg:py-8 lg:pl-8 lg:pr-0">
        <Sidebar />
      </div>
      <div className="order-1 lg:order-2 h-[50dvh] shrink-0 lg:h-full lg:flex-1 relative">
        <ThemeToggle />
        {!hasWebGL && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-neutral-300">
            <p className="max-w-sm">
              Your browser can't display the 3D globe (WebGL is turned off or
              not supported). You can still explore countries from the list.
            </p>
          </div>
        )}
        {hasWebGL && (
          <GlobeErrorBoundary onError={handleGlobeError}>
            <Canvas
              flat
              camera={{
                fov: 30,
                near: 0.1,
                far: 200,
              }}
              dpr={[1, 2]}
              gl={{ preserveDrawingBuffer: true }}
            >
              <color args={["#0f0f16"]} attach={"background"} />
              <Suspense fallback={null}>
                <Sun earthMaterialRef={earthMaterialRef} />
                <Earth
                  earthMaterialRef={earthMaterialRef}
                  onFirstFrame={handleFirstFrame}
                />
              </Suspense>
            </Canvas>
          </GlobeErrorBoundary>
        )}
      </div>
      <ToastProvider />
    </div>
  );
};

export default App;
