"use client";

import { Carousel, Typography, Button, Flex } from "antd";
import ComboCard from "@/app/(site)/collections/combos/components/ComboCard";
import Link from "next/link";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import type { CarouselRef } from "antd/es/carousel";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

interface TrendingBundlesProps {
  bundles: any[];
}

const TrendingBundles: React.FC<TrendingBundlesProps> = ({ bundles }) => {
  const carouselRef = useRef<CarouselRef>(null);

  if (!bundles || bundles.length === 0) return null;

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 section-spacing">
      <Flex justify="space-between" align="center" className="mb-8 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Flex vertical gap={4}>
            {/* Section label + Live badge */}
            <Flex align="center" gap={10}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#2e9e5b",
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
                  color: "#2e9e5b",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#2e9e5b",
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
          className="hidden md:flex ml-auto items-center"
        >
          {/* Desktop Navigation Arrows */}
          <Flex align="center" gap={8}>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              size="middle"
              className=" hover:border-[#2e9e5b]! hover:text-[#2e9e5b]!"
              onClick={() => carouselRef.current?.prev()}
            />
            <Button
              shape="circle"
              icon={<RightOutlined />}
              size="middle"
              className=" hover:border-[#2e9e5b]! hover:text-[#2e9e5b]!"
              onClick={() => carouselRef.current?.next()}
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
              className="hover:text-[#2e9e5b]!"
            >
              View All
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Carousel
        ref={carouselRef}
        dots={false}
        infinite={false}
        draggable
        slidesToShow={4}
        responsive={[
          {
            breakpoint: 1280,
            settings: { slidesToShow: 4 },
          },
          {
            breakpoint: 1024,
            settings: { slidesToShow: 3.2 },
          },
          {
            breakpoint: 640,
            settings: { slidesToShow: 2.2 },
          },
          {
            breakpoint: 0,
            settings: { slidesToShow: 1.2 },
          },
        ]}
      >
        {bundles.map((bundle) => (
          <div key={bundle.id} className="px-2">
            <ComboCard combo={bundle} />
          </div>
        ))}

        {/* Mobile "View All" Card */}
        <div className="px-2 md:hidden">
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
                background: "linear-gradient(135deg, #2e9e5b 0%, #26854b 100%)",
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
        </div>
      </Carousel>

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
              background: "#2e9e5b",
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
