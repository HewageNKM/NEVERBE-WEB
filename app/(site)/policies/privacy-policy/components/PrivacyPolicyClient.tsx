"use client";

import PrivacyPolicyContent from "./PrivacyPolicyContent";
import { Typography, Row, Col } from "antd";

const { Title, Text } = Typography;

const PrivacyPolicyClient = () => {
  return (
    <main className="w-full bg-surface text-primary-dark min-h-screen pt-8 md:pt-12">
      {/* 1. HERO SECTION */}
      <section className="w-full px-4 md:px-8 mb-20">
        <div className="max-w-content mx-auto">
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
      </section>

      {/* 2. CONTENT SECTION (Split Layout) */}
      <section className="w-full border-t border-strong px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-content mx-auto">
          <Row gutter={[48, 48]} justify="space-between">
            {/* Left: Sticky Headline */}
            <Col xs={24} md={8} lg={6}>
              <div className="sticky top-24 h-fit">
                <Title
                  level={2}
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    marginBottom: 16,
                  }}
                >
                  Legal Guidelines
                </Title>
                <div
                  style={{
                    height: 8,
                    width: 80,
                    background: "var(--color-primary)",
                  }}
                ></div>
              </div>
            </Col>

            {/* Right: Content */}
            <Col xs={24} md={16} lg={14}>
              <div className="max-w-3xl">
                <PrivacyPolicyContent />
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyClient;
