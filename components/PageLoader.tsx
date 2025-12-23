"use client";

/**
 * PageLoader - NEVERBE Performance Redesign
 * High-precision motion, Vibrant Green accents, and performance typography.
 */
const PageLoader = () => {
  return (
    <main className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface">
      {/* Simple Spinner */}
      <div className="w-10 h-10 rounded-full border-2 border-muted border-t-primary animate-spin mb-6"></div>

      {/* Brand Name */}
      <p className="text-sm font-display font-black uppercase tracking-widest text-primary">
        NEVERBE
      </p>
    </main>
  );
};

export default PageLoader;
