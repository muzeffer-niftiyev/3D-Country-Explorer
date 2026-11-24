import Sun from "./components/Sun";
import Earth from "./components/Earth";
import Sidebar from "./components/Sidebar";
import { Canvas } from "@react-three/fiber";
import GlobeNotice from "./components/GlobeNotice";
import IntroLoader from "./components/IntroLoader";
import ThemeToggle from "./components/ThemeToggle";
import ToastProvider from "./components/ToastProvider";
import GlobeErrorBoundary from "./components/GlobeErrorBoundary";
import { useLoadCountryList } from "./hooks/useCountrySelection";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

const hasWebGL = (() => {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
})();

const RECOVERY_DELAY_MS = 1000;
const MAX_LOSSES = 3;
const LOSS_WINDOW_MS = 2 * 60 * 1000;

const App = () => {
  const earthMaterialRef = useRef();
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isGlobeFailed, setIsGlobeFailed] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [recovery, setRecovery] = useState("none");
  const lossTimesRef = useRef([]);
  const recoveryTimerRef = useRef(null);

  useLoadCountryList();

  useEffect(() => () => clearTimeout(recoveryTimerRef.current), []);

  const handleFirstFrame = useCallback(() => {
    setIsGlobeReady(true);
    setRecovery("none");
  }, []);

  const handleGlobeError = useCallback(() => setIsGlobeFailed(true), []);

  const rebuildGlobe = useCallback(() => {
    clearTimeout(recoveryTimerRef.current);
    setRecovery("rebuilding");
    recoveryTimerRef.current = setTimeout(
      () => setCanvasKey((key) => key + 1),
      RECOVERY_DELAY_MS
    );
  }, []);

  const handleContextLost = useCallback(
    (event) => {
      event.preventDefault();
      const now = Date.now();
      lossTimesRef.current = [
        ...lossTimesRef.current.filter((time) => now - time < LOSS_WINDOW_MS),
        now,
      ];
      if (lossTimesRef.current.length > MAX_LOSSES) {
        clearTimeout(recoveryTimerRef.current);
        setRecovery("gave-up");
        return;
      }
      rebuildGlobe();
    },
    [rebuildGlobe]
  );

  const retryGlobe = useCallback(() => {
    lossTimesRef.current = [];
    setIsGlobeFailed(false);
    rebuildGlobe();
  }, [rebuildGlobe]);

  const handleCanvasCreated = useCallback(
    ({ gl }) => {
      gl.domElement.addEventListener("webglcontextlost", handleContextLost);
    },
    [handleContextLost]
  );

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] overflow-hidden">
      <IntroLoader isReady={isGlobeReady || isGlobeFailed || !hasWebGL} />

      <div className="order-2 lg:order-1 relative z-10 -mt-4 lg:mt-0 shrink-0 flex flex-col max-h-[78dvh] lg:max-h-none lg:flex-none lg:w-[35%] lg:h-full lg:py-8 lg:pl-8">
        <Sidebar />
      </div>
      <div className="order-1 lg:order-2 flex-1 min-h-[22dvh] lg:min-h-0 lg:h-full relative">
        <ThemeToggle />
        {!hasWebGL && (
          <GlobeNotice>
            Your browser can't display the 3D globe (WebGL is turned off or not
            supported). Restarting the browser may help. You can still explore
            countries from the list.
          </GlobeNotice>
        )}
        {recovery === "rebuilding" && (
          <GlobeNotice isBusy>
            The graphics card reset. Reloading the globe…
          </GlobeNotice>
        )}
        {recovery === "gave-up" && (
          <GlobeNotice onRetry={retryGlobe}>
            The 3D globe keeps getting interrupted by the graphics card. Close
            some other tabs or apps and try again. You can still explore
            countries from the list.
          </GlobeNotice>
        )}
        {hasWebGL && recovery !== "gave-up" && (
          <GlobeErrorBoundary
            key={canvasKey}
            onError={handleGlobeError}
            onRetry={retryGlobe}
          >
            <Canvas
              key={canvasKey}
              flat
              camera={{
                fov: 30,
                near: 0.1,
                far: 200,
              }}
              dpr={[1, 2]}
              gl={{ preserveDrawingBuffer: true }}
              onCreated={handleCanvasCreated}
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
