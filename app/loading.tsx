export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #ede9fe 65%, #dbeafe 100%)",
      }}
    >
      {/* Subtle noise/grain overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Glass card */}
      <div className="relative flex flex-col items-center gap-3 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 px-10 py-8"
           style={{ boxShadow: "0 20px 60px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
        {/* Inner highlight — top edge glint */}
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

        {/* Shield animation */}
        <div className="relative w-44 h-44 overflow-hidden flex items-center justify-center">
          <video
            autoPlay
            muted
            playsInline
            loop
            className="absolute w-[520px] h-auto pointer-events-none"
            style={{ transform: "scale(1.55)", transformOrigin: "center center" }}
          >
            <source src="/shield_animation.webm" type="video/webm" />
          </video>
        </div>

        <p className="text-slate-400 text-xs font-semibold tracking-[0.25em] uppercase animate-pulse">
          Loading
        </p>
      </div>
    </div>
  );
}
