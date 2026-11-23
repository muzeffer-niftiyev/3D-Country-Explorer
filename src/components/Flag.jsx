const NON_RECTANGULAR_FLAGS = ["NP"];

const Flag = ({ src, code, alt, onLoad, onError }) => {
  const isRectangular = !NON_RECTANGULAR_FLAGS.includes(code);

  return (
    <div className="h-[110px] sm:h-[140px] w-full flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        style={{ maxWidth: "min(260px, calc(100% - 4.5rem))" }}
        className={`block w-auto h-auto max-h-full transition-all duration-600 ${
          isRectangular
            ? "rounded-2xl border-4 border-neutral-800 dark:border-neutral-200"
            : "drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        }`}
      />
    </div>
  );
};

export default Flag;
