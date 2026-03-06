"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Row, Col, Card, Typography, Flex, Button } from "antd";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import { usePromotionsContext } from "@/components/PromotionsProvider";

const { Title, Text } = Typography;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  }),
};

const PromotionalAds: React.FC = () => {
  const { promotions: systemPromotions } = usePromotionsContext();
  const prevRef = React.useRef<HTMLButtonElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);

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
      <Flex
        vertical={false}
        align="center"
        justify="space-between"
        className="mb-10 gap-4 flex-col md:flex-row"
      >
        <Flex vertical gap={4} className="text-center md:text-left">
          <Text
            style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--color-accent)",
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
              color: "var(--color-primary-dark)",
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

        {/* Navigation Arrows */}
        <Flex align="center" gap={8} className="ml-auto hidden md:flex">
          <Button
            ref={prevRef}
            shape="circle"
            icon={<LeftOutlined style={{ fontSize: 14 }} />}
            className="w-10 h-10 flex items-center justify-center hover:border-accent! hover:text-accent!"
          />
          <Button
            ref={nextRef}
            shape="circle"
            icon={<RightOutlined style={{ fontSize: 14 }} />}
            className="w-10 h-10 flex items-center justify-center hover:border-accent! hover:text-accent!"
          />
        </Flex>
      </Flex>

      <div className="relative pb-4">
        <Swiper
          modules={[Navigation]}
          onInit={(s) => {
            if (
              s.params.navigation &&
              typeof s.params.navigation !== "boolean"
            ) {
              s.params.navigation.prevEl = prevRef.current;
              s.params.navigation.nextEl = nextRef.current;
              s.navigation.init();
              s.navigation.update();
            }
          }}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
          className="overflow-visible!"
        >
          {allPromotions.map((promo, index) => (
            <SwiperSlide key={promo.id}>
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
                    <div className="relative aspect-square md:aspect-[4/5] w-full">
                      <Image
                        src={promo.url}
                        alt={promo.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Bottom frosted glass panel */}
                      <div className="absolute inset-x-4 bottom-4 bg-white/80 backdrop-blur-md rounded-[24px] p-5 transition-transform duration-300 group-hover:-translate-y-2 border border-primary/20 shadow-custom">
                        <Title
                          level={3}
                          style={{
                            color: "var(--color-primary-dark)",
                            textTransform: "uppercase",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            fontSize: "clamp(1rem, 2vw, 1.5rem)",
                            marginBottom: 0,
                          }}
                        >
                          {promo.title}
                        </Title>

                        <Flex align="center" gap={8} className="mt-3">
                          <Text
                            style={{
                              color: "var(--color-primary-dark)",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                            className="group-hover:text-accent! transition-colors"
                          >
                            Shop Now
                          </Text>
                          <div
                            className="bg-white/80 backdrop-blur-sm border border-[rgba(46,158,91,0.2)] flex items-center justify-center transition-all duration-300 group-hover:bg-accent! group-hover:border-accent! shadow-custom"
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              padding: 0,
                            }}
                          >
                            <ArrowRightOutlined
                              style={{
                                color: "var(--color-primary-dark)",
                                fontSize: 12,
                              }}
                              className="group-hover:text-inverse! group-hover:translate-x-0.5 transition-all"
                            />
                          </div>
                        </Flex>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PromotionalAds;
