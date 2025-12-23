"use client";

/**
 * PageLoader - NEVERBE Premium Glass Theme
 * Full-page loading with liquid glass 3-dot animation.
 */
const PageLoader = () => {
  return (
    <main className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-surface">
      {/* Liquid Glass Container */}
      <div
        className="backdrop-blur-xl bg-white/60 rounded-3xl px-10 py-8 flex flex-col items-center"
        style={{
          boxShadow: `
            0 8px 32px rgba(151, 225, 62, 0.15),
            0 4px 16px rgba(0, 0, 0, 0.08),
            inset 0 1px 1px rgba(255, 255, 255, 0.8)
          `,
        }}
      >
        {/* 3-Dot Animation */}
        <div className="flex gap-3 mb-6">
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{
              animationDelay: "0ms",
              boxShadow: "0 4px 12px rgba(151, 225, 62, 0.4)",
            }}
          />
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{
              animationDelay: "150ms",
              boxShadow: "0 4px 12px rgba(151, 225, 62, 0.4)",
            }}
          />
          <div
            className="w-3 h-3 rounded-full bg-accent animate-bounce"
            style={{
              animationDelay: "300ms",
              boxShadow: "0 4px 12px rgba(151, 225, 62, 0.4)",
            }}
          />
        </div>

        {/* Brand Name */}
        <p className="text-xs font-display font-black uppercase tracking-[0.3em] text-primary">
          NEVERBE
        </p>
      </div>
    </main>
  );
};

export default PageLoader;
