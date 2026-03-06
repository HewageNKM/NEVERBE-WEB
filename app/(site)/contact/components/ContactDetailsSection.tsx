"use client";
import React from "react";
import { contactInfo } from "@/constants";
import Link from "next/link";
import { Typography, Space } from "antd";

const { Title, Text } = Typography;

const ContactDetailsSection = () => {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <Title
          level={2}
          style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Get in Touch
        </Title>
        <div
          style={{ height: 4, width: 48, background: "var(--color-primary)" }}
        ></div>
      </div>

      <Text
        style={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--color-primary-dark)",
          lineHeight: 1.6,
          maxWidth: 400,
        }}
      >
        For inquiries regarding online orders, shipping, or returns, please
        contact our support team. We typically respond within 24 hours.
      </Text>

      <Space direction="vertical" size={24}>
        {contactInfo.map((info, idx) => (
          <div key={idx}>
            <Link
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-start gap-1"
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-primary-300)",
                }}
                className="group-hover:text-primary-dark transition-colors"
              >
                {(info as any).title || "Contact"}
              </Text>
              <div className="flex items-center gap-3">
                <info.icon size={20} className="text-primary-dark" />
                <Text
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 800,
                    color: "var(--color-primary-dark)",
                  }}
                  className="border-b border-transparent group-hover:border-primary transition-all"
                >
                  {info.content}
                </Text>
              </div>
            </Link>
          </div>
        ))}
      </Space>
    </section>
  );
};

export default ContactDetailsSection;
