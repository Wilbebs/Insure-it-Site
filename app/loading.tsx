export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: "#dbeafe",
        backgroundImage:
          "radial-gradient(circle, rgba(99,130,220,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* Shield animation directly on background — animated WebP plays
          natively (with proper alpha) in every modern browser including
          iOS Safari 14+. No <video> autoplay quirks. */}
      <div className="relative w-44 h-44 overflow-hidden flex items-center justify-center">
        <img
          src="https://d3gkfgi9drj9kb.cloudfront.net/image-assets/shield_animation.webp"
          alt=""
          aria-hidden="true"
          className="absolute w-[520px] h-auto pointer-events-none"
          style={{ transform: "scale(1.55)", transformOrigin: "center center" }}
          draggable={false}
        />
      </div>

      <p className="text-slate-500 text-xs font-semibold tracking-[0.25em] uppercase animate-pulse mt-1">
        Loading
      </p>
    </div>
  );
}
