"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Row, Col, Card, Typography, Flex } from "antd";
import { collectionList } from "@/constants";
import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

// Reusable gradient overlay + hover CTA for each category card
const CategoryCardInner = ({ label }: { label: string }) => (
  <>
    {/* Dark gradient so label always reads on any image */}
    <div
      className="absolute inset-x-0 bottom-0 z-10 pointer-events-none transition-all duration-500"
      style={{
        height: "65%",
        background:
          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
      }}
    />
    {/* CTA row */}
    <div className="absolute inset-x-0 bottom-0 p-5 z-20">
      <Flex align="center" justify="space-between">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 99,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            fontWeight: 800,
            fontSize: 12,
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            color: "#fff",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
          className="group-hover:!bg-[#2e9e5b] group-hover:!text-black group-hover:!border-transparent"
        >
          {label}
        </span>
        <div
          className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#2e9e5b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ArrowRightOutlined style={{ color: "#fff", fontSize: 16 }} />
        </div>
      </Flex>
    </div>
  </>
);

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
              color: "#2e9e5b",
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
            Shop by Category
          </Title>
        </Flex>
        <Link href="/collections/products" className="hidden md:block">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: 12,
              transition: "color 0.3s ease",
            }}
            className="hover:!text-[#2e9e5b]"
          >
            View All <ArrowRightOutlined />
          </span>
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
                    borderRadius: 24,
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
                    <CategoryCardInner label={collectionList[0].label} />
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
                        borderRadius: 24,
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
                        <CategoryCardInner label={item.label} />
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
