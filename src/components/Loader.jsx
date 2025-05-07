import { Html } from "@react-three/drei";
import React from "react";

const Loader = () => {
  return (
    <Html>
      <div className="w-full h-full flex">
        <svg class="h-10 w-10 animate-spin text-[#eee]" viewBox="0 0 100 100">
          <circle
            fill="none"
            stroke-width="10"
            class="stroke-current opacity-40"
            cx="50"
            cy="50"
            r="40"
          />
          <circle
            fill="none"
            stroke-width="10"
            class="stroke-current"
            stroke-dasharray="250"
            stroke-dashoffset="210"
            cx="50"
            cy="50"
            r="40"
          />
        </svg>
      </div>
    </Html>
  );
};

export default Loader;
