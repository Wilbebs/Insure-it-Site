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
      {/* Shield animation directly on background */}
      <div className="relative w-44 h-44 overflow-hidden flex items-center justify-center">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="absolute w-[520px] h-auto pointer-events-none"
          style={{ transform: "scale(1.55)", transformOrigin: "center center" }}
        >
          <source src="https://d3gkfgi9drj9kb.cloudfront.net/video-assets/shield_animation.webm" type="video/webm" />
        </video>
      </div>

      <p className="text-slate-500 text-xs font-semibold tracking-[0.25em] uppercase animate-pulse mt-1">
        Loading
      </p>
    </div>
  );
}
