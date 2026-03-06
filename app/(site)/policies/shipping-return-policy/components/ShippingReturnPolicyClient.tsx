"use client";

import ShippingReturnPolicyContent from "./ShippingReturnPolicyContent";
import { Typography } from "antd";

const { Title, Text } = Typography;

const ShippingReturnPolicyClient = () => {
  return (
    <main className="w-full min-h-screen bg-white pt-8 md:pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 border-b border-primary pb-8">
          <Title
            level={1}
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "var(--color-primary-dark)",
              margin: 0,
            }}
          >
            Shipping & <br /> Returns
          </Title>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Customer Service
            </p>
            <div className="hidden md:block h-px w-12 bg-default"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Exchange Guidelines
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl">
          <ShippingReturnPolicyContent />
        </div>
      </div>
    </main>
  );
};

export default ShippingReturnPolicyClient;
