export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
      <div className="relative flex flex-col items-center gap-4">
        {/* Shield animation — cropped the same way as the navbar logo */}
        <div className="relative w-48 h-48 overflow-hidden flex items-center justify-center">
          <video
            autoPlay
            muted
            playsInline
            loop
            className="absolute w-[560px] h-auto pointer-events-none"
            style={{ transform: "scale(1.55)", transformOrigin: "center center" }}
          >
            <source src="/shield_animation.webm" type="video/webm" />
          </video>
        </div>

        <p className="text-white/60 text-sm font-medium tracking-widest uppercase animate-pulse">
          Loading
        </p>
      </div>
    </div>
  );
}
