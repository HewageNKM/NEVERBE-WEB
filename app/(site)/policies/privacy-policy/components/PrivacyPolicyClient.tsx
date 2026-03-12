"use client";

import PrivacyPolicyContent from "./PrivacyPolicyContent";
import { Typography } from "antd";

const { Title, Text } = Typography;

const PrivacyPolicyClient = () => {
  return (
    <main className="w-full min-h-screen bg-surface pt-8 md:pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-content mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-20 border-b border-accent pb-8">
          <Title
            level={1}
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              color: "var(--color-primary)",
              margin: 0,
            }}
          >
            Privacy <br /> Policy
          </Title>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="hidden md:block h-px w-12 bg-default"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Legal & Compliance
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl">
          <PrivacyPolicyContent />
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyClient;
