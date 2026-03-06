"use client";
import React from "react";
import { Flex, Spin, Typography, ConfigProvider } from "antd";

/**
 * CheckoutLoader - Full-page Liquid Glass Loader
 * Premium liquid glass effect with 3-dot animation and processing message.
 */
const CheckoutLoader = () => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      className="fixed inset-0 z-300 overflow-hidden"
    >
      {/* Liquid Glass Background */}
      <div
        className="absolute inset-0 backdrop-blur-2xl"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(46, 158, 91, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(46, 158, 91, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 245, 0.98) 100%)
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03)
          `,
        }}
      />

      {/* Content */}
      <Flex vertical align="center" gap={40} className="relative z-10">
        <Flex vertical align="center" gap={16}>
          {/* Branded Spin */}
          <div className="relative">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "var(--color-primary)",
                },
              }}
            >
              <Spin size="large" />
            </ConfigProvider>
          </div>

          <Flex vertical align="center" gap={4}>
            <Typography.Title
              level={4}
              className="uppercase tracking-widest text-primary m-0"
              style={{ margin: 0, fontWeight: 900, fontSize: "1.125rem" }}
            >
              Processing Order
            </Typography.Title>
            <Typography.Text
              type="secondary"
              className="text-xs font-medium text-primary-400"
            >
              Please wait while we secure your order
            </Typography.Text>
          </Flex>
        </Flex>

        <Typography.Text className="text-[10px] uppercase font-black tracking-widest text-accent/60 animate-pulse">
          Do not close this page
        </Typography.Text>
      </Flex>
    </Flex>
  );
};

export default CheckoutLoader;
