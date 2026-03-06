"use client";

import React from "react";
import { termsAndConditions } from "@/constants";
import { Typography, Row, Col } from "antd";

const { Title, Paragraph, Text } = Typography;

const TermsContent = () => {
  return (
    <div className="flex flex-col">
      {termsAndConditions.map((item, index) => (
        <Row
          key={index}
          className="group py-10 border-t border-default first:border-none w-full"
          gutter={[32, 24]}
        >
          {/* Index Number - Sticky feel */}
          <Col xs={24} md={4} lg={3}>
            <Text
              className="group-hover:text-primary transition-colors"
              style={{
                fontSize: 12,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-muted, #9ca3af)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </Text>
          </Col>

          {/* Content Body */}
          <Col xs={24} md={20} lg={21}>
            <div className="flex flex-col gap-3 max-w-3xl">
              <Title
                level={2}
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  color: "var(--color-primary, var(--color-primary-400))",
                  marginBottom: 8,
                }}
              >
                {item.title}
              </Title>
              <Paragraph
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--color-secondary, #4b5563)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                  margin: 0,
                }}
              >
                {item.description}
              </Paragraph>
            </div>
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default TermsContent;
