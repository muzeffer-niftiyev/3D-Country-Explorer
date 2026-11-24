const NON_RECTANGULAR_FLAGS = ["NP"];

const Flag = ({
  src,
  code,
  alt,
  onLoad,
  onError,
  className = "h-[110px] sm:h-[140px] w-full",
  imgClassName = "max-w-[min(260px,calc(100%_-_4.5rem))]",
}) => {
  const isRectangular = !NON_RECTANGULAR_FLAGS.includes(code);

  return (
    <div className={`shrink-0 flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        onError={onError}
        className={`block w-auto h-auto max-h-full transition-all duration-600 ${imgClassName} ${
          isRectangular
            ? "rounded-lg border-2 lg:rounded-2xl lg:border-4 border-neutral-800 dark:border-neutral-200"
            : "drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        }`}
      />
    </div>
  );
};

export default Flag;
