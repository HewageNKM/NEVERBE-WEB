"use client";
import React from "react";
import {
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
} from "react-icons/hi";
import { BiSupport } from "react-icons/bi";
import { Row, Col, Typography, Flex } from "antd";
import { motion } from "framer-motion";

const { Text } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as any,
    },
  }),
};

const WhyUs = () => {
  const benefits = [
    {
      title: "Island-wide Delivery",
      desc: "Fast delivery to your doorstep.",
      icon: HiOutlineTruck,
      number: "01",
    },
    {
      title: "Cash on Delivery",
      desc: "Pay when you receive.",
      icon: HiOutlineShieldCheck,
      number: "02",
    },
    {
      title: "Easy Returns",
      desc: "Hassle-free exchange policy.",
      icon: HiOutlineRefresh,
      number: "03",
    },
    {
      title: "Premium Support",
      desc: "Call us anytime: 070 520 8999",
      icon: BiSupport,
      number: "04",
    },
  ];

  return (
    <section
      className="w-full"
      style={{
        background: "#f8faf5",
        padding: "52px 0",
      }}
    >
      {/* Thin green top separator */}
      <div className="green-separator mb-12" />

      <div className="max-w-content mx-auto px-4 md:px-8">
        {/* Mobile: Grid Layout (Left Justified) */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="w-full group"
                style={{
                  padding: "20px 16px",
                  borderRadius: 20,
                  background: "#fff",
                  border: "1px solid rgba(46, 158, 91, 0.2)",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  height: "100%",
                }}
              >
                {/* Watermark digit */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -8,
                    right: 10,
                    fontSize: 72,
                    fontWeight: 900,
                    lineHeight: 1,
                    color: "rgba(46, 158, 91, 0.10)",
                    fontFamily: "var(--font-display), sans-serif",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {item.number}
                </span>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(46, 158, 91, 0.18) 0%, rgba(46, 158, 91, 0.06) 100%)",
                    border: "1px solid rgba(46, 158, 91, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <item.icon size={22} style={{ color: "#2e9e5b" }} />
                </div>
                <Text
                  style={{
                    margin: 0,
                    textTransform: "uppercase",
                    fontWeight: 900,
                    letterSpacing: "-0.01em",
                    fontSize: 12,
                    color: "#1a1a1a",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    display: "block",
                    color: "#777",
                  }}
                >
                  {item.desc}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:block">
          <Row gutter={[24, 24]} justify="center">
            {benefits.map((item, index) => (
              <Col md={6} key={index}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                >
                  <div
                    className="group relative overflow-hidden h-full"
                    style={{
                      padding: "28px 20px",
                      borderRadius: 20,
                      background: "#fff",
                      border: "1px solid rgba(46, 158, 91, 0.15)",
                      boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      borderLeft: "3px solid rgba(46, 158, 91, 0.5)",
                      cursor: "default",
                    }}
                  >
                    {/* Watermark digit */}
                    <span
                      className="transition-all duration-500 group-hover:text-[rgba(46, 158, 91,0.12)]"
                      style={{
                        position: "absolute",
                        bottom: -8,
                        right: 10,
                        fontSize: 88,
                        fontWeight: 900,
                        lineHeight: 1,
                        color: "rgba(46, 158, 91, 0.07)",
                        fontFamily: "var(--font-display), sans-serif",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {item.number}
                    </span>

                    <Flex vertical gap={12}>
                      <div
                        className="transition-all duration-400 group-hover:scale-110"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, rgba(46, 158, 91, 0.2) 0%, rgba(46, 158, 91, 0.08) 100%)",
                          border: "1px solid rgba(46, 158, 91, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        <item.icon
                          size={24}
                          style={{
                            color: "#2e9e5b",
                            transition: "color 0.3s ease",
                          }}
                        />
                      </div>
                      <div>
                        <Text
                          style={{
                            margin: 0,
                            textTransform: "uppercase",
                            fontWeight: 900,
                            letterSpacing: "-0.01em",
                            fontSize: 12,
                            color: "#1a1a1a",
                            display: "block",
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            display: "block",
                            marginTop: 4,
                            color: "#777",
                          }}
                        >
                          {item.desc}
                        </Text>
                      </div>
                    </Flex>
                  </div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
