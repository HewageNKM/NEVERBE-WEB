"use client";

import { Typography, Button, Flex } from "antd";
import ComboCard from "@/app/(site)/collections/combos/components/ComboCard";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import { motion } from "framer-motion";
import "swiper/css";

const { Title, Text } = Typography;

interface TrendingBundlesProps {
  bundles: any[];
}

const TrendingBundles: React.FC<TrendingBundlesProps> = ({ bundles }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!bundles || bundles.length === 0) return null;

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 section-spacing">
      <Flex
        vertical={false}
        justify="space-between"
        align="center"
        className="mb-10 md:mb-8 gap-4 flex-col md:flex-row"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Flex
            vertical
            gap={4}
            className="text-center md:text-left w-full md:w-auto"
          >
            {/* Section label + Live badge */}
            <Flex
              align="center"
              gap={10}
              className="justify-center md:justify-start"
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--color-accent)",
                }}
              >
                Save More
              </Text>
              {/* Pulsing "Live Deals" badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 99,
                  background: "rgba(46, 158, 91,0.1)",
                  border: "1px solid rgba(46, 158, 91,0.25)",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: "var(--color-accent)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    display: "inline-block",
                  }}
                  className="pulse-green"
                />
                Live Deals
              </span>
            </Flex>

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
              Trending Bundles
            </Title>
            <Text
              type="secondary"
              style={{ marginTop: 4, display: "block", fontSize: 13 }}
            >
              Save big with our exclusive combo deals. Buy more, pay less.
            </Text>
          </Flex>
        </motion.div>

        <Flex
          align="center"
          gap={12}
          className="w-full md:w-auto justify-between md:justify-end items-center"
        >
          {/* Desktop Navigation Arrows */}
          <Flex align="center" gap={12} className="ml-auto">
            <Button
              ref={prevRef}
              shape="circle"
              icon={
                <LeftOutlined style={{ fontSize: "clamp(12px, 2vw, 14px)" }} />
              }
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-accent! hover:text-accent!"
            />
            <Button
              ref={nextRef}
              shape="circle"
              icon={
                <RightOutlined style={{ fontSize: "clamp(12px, 2vw, 14px)" }} />
              }
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-accent! hover:text-accent!"
            />
          </Flex>

          <Link href="/collections/combos">
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
              className="hover:text-accent!"
            >
              View All
            </Button>
          </Link>
        </Flex>
      </Flex>

      <div className="relative pb-4 mt-6 md:mt-0">
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
          spaceBetween={16}
          slidesPerView={1.3}
          breakpoints={{
            768: { slidesPerView: 3.2 },
            1280: { slidesPerView: 4.2 },
          }}
          className="overflow-visible!"
        >
          {bundles.map((bundle) => (
            <SwiperSlide key={bundle.id}>
              <ComboCard combo={bundle} />
            </SwiperSlide>
          ))}

          {/* Mobile "View All" Slide */}
          <SwiperSlide className="px-2 md:hidden">
            <Link
              href="/collections/combos"
              className=" flex flex-col items-center justify-center w-full aspect-4/5 rounded-[24px] transition-all duration-300 group"
              style={{
                border: "1px solid rgba(46, 158, 91, 0.15)",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
                className="group-active:scale-95 transition-transform"
              >
                <ArrowRightOutlined style={{ fontSize: 22, color: "#fff" }} />
              </div>
              <Text
                strong
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                Explore All Bundles
              </Text>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Mobile sticky CTA */}
      <Flex justify="center" className="mt-6 md:hidden">
        <Link href="/collections/combos">
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            size="large"
            shape="round"
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: 12,
              padding: "0 28px",
              height: 48,
            }}
          >
            See All Bundles
          </Button>
        </Link>
      </Flex>
    </section>
  );
};

export default TrendingBundles;
