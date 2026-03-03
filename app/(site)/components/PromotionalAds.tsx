"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Row, Col, Card, Typography, Flex } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import { usePromotionsContext } from "@/components/PromotionsProvider";

const { Title, Text } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

const PromotionalAds: React.FC = () => {
  const { promotions: systemPromotions } = usePromotionsContext();

  const allPromotions = systemPromotions
    .filter((p) => p.bannerUrl && p.isActive)
    .map((p) => ({
      id: p.id,
      title: p.name,
      url: p.bannerUrl!,
      link: "/collections/deals",
      type: "SYSTEM",
    }));

  if (!allPromotions || allPromotions.length === 0) return null;

  return (
    <section className="w-full section-spacing px-4 md:px-8 max-w-content mx-auto">
      <Flex vertical gap={4} className="mb-10">
        <Text
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#2e9e5b",
          }}
        >
          Limited Time
        </Text>
        <Title
          level={2}
          style={{
            margin: 0,
            textTransform: "uppercase",
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          Featured Offers
        </Title>
        <Text
          type="secondary"
          style={{
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: "0.05em",
            fontSize: 12,
          }}
        >
          Exclusive deals just for you
        </Text>
      </Flex>

      <Row gutter={[20, 20]}>
        {allPromotions.map((promo, index) => (
          <Col
            xs={24}
            md={
              allPromotions.length === 1
                ? 24
                : allPromotions.length === 2
                  ? 12
                  : 8
            }
            key={promo.id}
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              style={{ height: "100%" }}
            >
              <Link href={promo.link} className="block h-full">
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: 24,
                    overflow: "hidden",
                    border: "none",
                  }}
                  styles={{ body: { padding: 0 } }}
                  className="group"
                >
                  <div className="relative aspect-video md:aspect-2/1 lg:aspect-video w-full">
                    <Image
                      src={promo.url}
                      alt={promo.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Bottom frosted glass panel */}
                    <div className="absolute inset-x-4 bottom-4 bg-white/80 backdrop-blur-md rounded-[24px] p-5 transition-transform duration-300 group-hover:-translate-y-2 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                      <Title
                        level={3}
                        style={{
                          color: "#1a1a1a",
                          margin: 0,
                          textTransform: "uppercase",
                          fontWeight: 900,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {promo.title}
                      </Title>

                      <Flex align="center" gap={8} className="mt-3">
                        <Text
                          style={{
                            color: "rgba(0,0,0,0.6)",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontSize: 12,
                          }}
                          className="group-hover:text-[#2e9e5b]! transition-colors"
                        >
                          Shop Now
                        </Text>
                        <div
                          className="bg-white/80 backdrop-blur-sm border border-[rgba(46, 158, 91,0.2)] flex items-center justify-center transition-all duration-300 group-hover:bg-[#2e9e5b]! group-hover:border-[#2e9e5b]! shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            padding: 0,
                          }}
                        >
                          <ArrowRightOutlined
                            style={{
                              color: "rgba(0,0,0,0.8)",
                              fontSize: 14,
                            }}
                            className="group-hover:text-black! group-hover:translate-x-0.5 transition-all"
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
    </section>
  );
};

export default PromotionalAds;
