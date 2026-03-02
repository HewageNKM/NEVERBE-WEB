"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Row, Col, Card, Typography, Button, Flex } from "antd";
import { collectionList } from "@/constants";
import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  }),
};

const FeaturedCategories = () => {
  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 section-spacing">
      <Flex align="end" justify="space-between" className="mb-10">
        <Flex vertical gap={4}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#97e13e",
            }}
          >
            Collections
          </Text>
          <Title
            level={2}
            style={{
              textTransform: "uppercase",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            The Essentials
          </Title>
        </Flex>
        <Link href="/collections/products" className="hidden md:block">
          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            style={{
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: 12,
            }}
            className="hover:!text-[#97e13e]"
          >
            View All
          </Button>
        </Link>
      </Flex>

      <Row gutter={[20, 20]} align="stretch">
        {/* First Item — Large Feature Card */}
        {collectionList[0] && (
          <Col xs={24} md={8}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              style={{ height: "100%" }}
            >
              <Link
                href={collectionList[0].url}
                className="block w-full h-full"
              >
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    minHeight: 420,
                    overflow: "hidden",
                    padding: 0,
                    border: "none",
                    borderRadius: 28,
                  }}
                  styles={{ body: { padding: 0, height: "100%" } }}
                  className="group"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={collectionList[0].image}
                      alt={collectionList[0].label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Glassmorphic bottom overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 p-6 transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                      }}
                    >
                      <Flex align="center" justify="space-between">
                        <Button
                          type="default"
                          shape="round"
                          size="large"
                          style={{
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontSize: 12,
                            background: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.5)",
                          }}
                        >
                          {collectionList[0].label}
                        </Button>
                        <div
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2"
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "rgba(151, 225, 62, 0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(151, 225, 62, 0.4)",
                          }}
                        >
                          <ArrowRightOutlined
                            style={{ color: "#000", fontSize: 16 }}
                          />
                        </div>
                      </Flex>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </Col>
        )}

        {/* Second & Third Items — Side Cards */}
        <Col xs={24} md={16}>
          <Row gutter={[20, 20]} style={{ height: "100%" }}>
            {collectionList.slice(1, 3).map((item, idx) => (
              <Col xs={24} sm={12} key={idx} style={{ height: "100%" }}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={idx + 1}
                  style={{ height: "100%" }}
                >
                  <Link href={item.url} className="block w-full h-full">
                    <Card
                      hoverable
                      style={{
                        height: "100%",
                        minHeight: 300,
                        overflow: "hidden",
                        padding: 0,
                        border: "none",
                        borderRadius: 28,
                      }}
                      styles={{ body: { padding: 0, height: "100%" } }}
                      className="group"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.label}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 p-6"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
                          }}
                        >
                          <Flex align="center" justify="space-between">
                            <Button
                              type="default"
                              shape="round"
                              size="large"
                              style={{
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                fontSize: 12,
                                background: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(12px)",
                                border: "1px solid rgba(255,255,255,0.5)",
                              }}
                            >
                              {item.label}
                            </Button>
                            <div
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2"
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "rgba(151, 225, 62, 0.9)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 16px rgba(151, 225, 62, 0.4)",
                              }}
                            >
                              <ArrowRightOutlined
                                style={{ color: "#000", fontSize: 16 }}
                              />
                            </div>
                          </Flex>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default FeaturedCategories;
