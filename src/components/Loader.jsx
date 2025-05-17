const Loader = ({ color }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg
        className={`h-10 w-10 animate-spin ${
          color || "text-neutral-900 dark:text-[#eee]"
        }`}
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
  );
};

export default Loader;
