import { useState } from "react";

const NON_RECTANGULAR_FLAGS = ["NP"];
const DEFAULT_RATIO = 3 / 2;

const DEFAULT_SIZE =
  "h-[110px] sm:h-[140px] w-full [--flag-h:110px] sm:[--flag-h:140px] [--flag-max-w:min(260px,calc(100%_-_4.5rem))]";

const Flag = ({ src, code, alt, onLoad, onError, className = DEFAULT_SIZE }) => {
  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const isRectangular = !NON_RECTANGULAR_FLAGS.includes(code);
  const border = isRectangular ? "var(--flag-b)" : "0px";

  const handleLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight);
    onLoad?.(event);
  };

  return (
    <div
      className={`shrink-0 flex items-center justify-center [--flag-b:2px] lg:[--flag-b:4px] ${className}`}
    >
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={onError}
        style={{
          aspectRatio: ratio,
          width: `min(var(--flag-max-w), calc((var(--flag-h) - 2 * ${border}) * ${ratio}))`,
        }}
        className={`block box-content h-auto transition-colors duration-600 ${
          isRectangular
            ? "rounded-lg border-2 lg:rounded-2xl lg:border-4 border-neutral-800 dark:border-neutral-200"
            : "drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        }`}
      />
    </div>
  );
};

export default Flag;
