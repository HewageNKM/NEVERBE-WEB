"use client";

/**
 * PageLoader - NEVERBE Performance Redesign
 * Full-page premium loading experience with brand identity.
 */
const PageLoader = () => {
  return (
    <main className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-dark">
      {/* Pulsating Logo Container */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Ring Pulse */}
        <div className="absolute w-24 h-24 rounded-full border border-accent/30 animate-ping" />

        {/* Inner Ring */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-accent/50 animate-pulse" />

        {/* Center Circle with Brand */}
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-2xl font-display font-black text-accent">
            N
          </span>
        </div>
      </div>

      {/* Brand Name */}
      <p className="text-sm font-display font-black uppercase tracking-[0.3em] text-accent mb-4">
        NEVERBE
      </p>

      {/* Loading Bar */}
      <div className="w-32 h-0.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full w-full bg-linear-to-r from-accent via-primary to-accent animate-shimmer"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </main>
  );
};

export default PageLoader;
