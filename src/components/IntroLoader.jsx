import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

const FADE_MS = 700;

const IntroLoader = ({ isReady }) => {
  const { progress } = useProgress();
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => setIsGone(true), FADE_MS);
    return () => clearTimeout(timer);
  }, [isReady]);

  if (isGone) return null;

  const percent = isReady ? 100 : Math.min(95, Math.round(progress));

  return (
    <div
      aria-busy={!isReady}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#0f0f16] text-[#eee] px-6 transition-opacity ease-out ${
        isReady ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="intro-stars" aria-hidden="true" />

      <div className="relative" aria-hidden="true">
        <div className="intro-orbit" />
        <div className="intro-earth" />
      </div>

      <h1 className="relative text-2xl sm:text-3xl font-bold tracking-tight">
        Country Explorer
      </h1>

      <div
        role="progressbar"
        aria-label="Loading the globe"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="relative w-64 max-w-full h-1.5 rounded-full bg-white/10 overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0a96db] to-[#6ec3ff] transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default IntroLoader;
