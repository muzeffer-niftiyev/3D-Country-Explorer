import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html>
      <div className="w-full h-full flex">
        <svg
          className="h-10 w-10 animate-spin text-[#eee]"
          viewBox="0 0 100 100"
        >
          <circle
            fill="none"
            strokeWidth="15"
            className="stroke-current opacity-40"
            cx="50"
            cy="50"
            r="40"
          />
          <circle
            fill="none"
            strokeWidth="15"
            className="stroke-current"
            strokeDasharray="250"
            strokeDashoffset="210"
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
