import { RotateCcw } from "lucide-react";

const GlobeNotice = ({ children, isBusy = false, onRetry }) => (
  <div
    role="status"
    className="absolute inset-0 z-1 flex flex-col items-center justify-center gap-4 p-6 text-center bg-[#0f0f16] text-neutral-300"
  >
    {isBusy && (
      <span
        aria-hidden="true"
        className="w-8 h-8 rounded-full border-[3px] border-white/20 border-t-white motion-safe:animate-spin"
      />
    )}
    <p className="max-w-sm">{children}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg border-2 border-neutral-600 bg-[#1d1d20] px-4 py-2 font-semibold text-[#eee] cursor-pointer hover:bg-[#26262a] transition-colors duration-200"
      >
        <RotateCcw size={18} aria-hidden="true" />
        Try again
      </button>
    )}
  </div>
);

export default GlobeNotice;
