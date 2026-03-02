"use client";
import React from "react";
import {
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
} from "react-icons/hi";
import { BiSupport } from "react-icons/bi";
import { Row, Col, Card, Typography, Flex } from "antd";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

const WhyUs = () => {
  const benefits = [
    {
      title: "Island-wide Delivery",
      desc: "Fast delivery to your doorstep.",
      icon: HiOutlineTruck,
    },
    {
      title: "Cash on Delivery",
      desc: "Pay when you receive.",
      icon: HiOutlineShieldCheck,
    },
    {
      title: "Easy Returns",
      desc: "Hassle-free exchange policy.",
      icon: HiOutlineRefresh,
    },
    {
      title: "Premium Support",
      desc: "Call us anytime: 070 520 8999",
      icon: BiSupport,
    },
  ];

  return (
    <section className="w-full section-spacing">
      <div
        className="max-w-content mx-auto px-4 md:px-8 py-12 md:py-16 rounded-none md:rounded-[32px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(248,250,245,0.95) 0%, rgba(255,255,255,0.98) 50%, rgba(248,250,245,0.95) 100%)",
        }}
      >
        <Flex vertical align="center" className="mb-10">
          <Text
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#97e13e",
              marginBottom: 4,
            }}
          >
            Why Choose Us
          </Text>
          <Title
            level={3}
            style={{
              margin: 0,
              textTransform: "uppercase",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            Built for Performance
          </Title>
        </Flex>

        <Row gutter={[20, 20]}>
          {benefits.map((item, index) => (
            <Col xs={12} md={6} key={index}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                style={{ height: "100%" }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 24,
                    height: "100%",
                    textAlign: "center",
                    border: "1px solid rgba(151, 225, 62, 0.12)",
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                  }}
                  styles={{ body: { padding: "28px 20px" } }}
                  className="group glass-glow-hover"
                >
                  <Flex vertical align="center" gap={16}>
                    <div
                      className="transition-all duration-400 group-hover:scale-110"
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        background:
                          "linear-gradient(135deg, rgba(151, 225, 62, 0.1) 0%, rgba(151, 225, 62, 0.05) 100%)",
                        border: "1px solid rgba(151, 225, 62, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <item.icon
                        size={28}
                        style={{
                          color: "#5fa31a",
                          transition: "color 0.3s ease",
                        }}
                      />
                    </div>
                    <div>
                      <Title
                        level={5}
                        style={{
                          margin: 0,
                          textTransform: "uppercase",
                          fontWeight: 900,
                          letterSpacing: "-0.01em",
                          fontSize: 13,
                        }}
                      >
                        {item.title}
                      </Title>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          display: "block",
                          marginTop: 6,
                        }}
                      >
                        {item.desc}
                      </Text>
                    </div>
                  </Flex>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default WhyUs;
