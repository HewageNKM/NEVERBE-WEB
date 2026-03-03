"use client";
import React from "react";

import { Spin, ConfigProvider } from "antd";

/**
 * ComponentLoader - NEVERBE Liquid Glass
 * Overlay with liquid glass effect and Ant Design loading animation.
 */
const ComponentLoader = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-30 overflow-hidden">
      {/* Liquid Glass Background */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 245, 0.88) 100%),
            radial-gradient(ellipse at 30% 30%, rgba(46, 158, 91, 0.05) 0%, transparent 60%)
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.7),
            inset 0 -1px 0 rgba(0, 0, 0, 0.02)
          `,
        }}
      />

      {/* Ant Design Spin Loader */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#2e9e5b",
            },
          }}
        >
          <Spin size="large" />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default ComponentLoader;
