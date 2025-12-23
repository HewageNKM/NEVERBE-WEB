"use client";

/**
 * PageLoader - NEVERBE Liquid Glass
 * Full-page loading with premium liquid glass effect and 3-dot animation.
 */
const PageLoader = () => {
  return (
    <main className="fixed inset-0 z-200 flex flex-col items-center justify-center overflow-hidden">
      {/* Liquid Glass Background */}
      <div
        className="absolute inset-0 bg-white/80 backdrop-blur-2xl"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(151, 225, 62, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(151, 225, 62, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 245, 0.95) 100%)
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 3-Dot Animation */}
        <div className="flex gap-4 mb-6">
          <div
            className="w-4 h-4 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-4 h-4 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-4 h-4 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "300ms" }}
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
