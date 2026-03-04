"use client";

import { Spin, ConfigProvider } from "antd";

/**
 * PageLoader - NEVERBE Liquid Glass
 * Full-page loading with premium liquid glass effect and Ant Design loading animation.
 */
const PageLoader = () => {
  return (
    <main className="fixed inset-0 z-200 flex flex-col items-center justify-center overflow-hidden">
      {/* Liquid Glass Background */}
      <div
        className="absolute inset-0 bg-white/80 backdrop-blur-2xl"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(46, 158, 91, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(46, 158, 91, 0.06) 0%, transparent 50%),
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
        {/* Ant Design Spin Loader */}
        <div className="mb-6 flex items-center justify-center">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "var(--color-accent)",
              },
            }}
          >
            <Spin size="large" />
          </ConfigProvider>
        </div>

        {/* Brand Name */}
        <p className="text-xs font-display font-black uppercase tracking-[0.3em] text-primary mt-2">
          NEVERBE
        </p>
      </div>
    </main>
  );
};

export default PageLoader;
