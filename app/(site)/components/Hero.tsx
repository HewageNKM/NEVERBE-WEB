"use client";
import ImagesSlider from "@/app/(site)/components/ImagesSlider";
import { Slide } from "@/interfaces/BagItem";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography, Button, Flex, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Hero = ({ slides }: { slides: Slide[] }) => {
  return (
    <section className="w-full relative overflow-hidden">
      {/* Full Width Slider */}
      <div className="w-full h-[65vh] md:h-[90vh] relative">
        <ImagesSlider images={slides} />

        {/* Hero Overlay — Glassmorphic Floating Card */}
        <div className="absolute inset-x-0 bottom-8 md:bottom-16 z-10 flex justify-center pointer-events-none px-4">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 80,
              damping: 20,
            }}
            className="pointer-events-auto"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: 32,
              padding: "clamp(24px, 4vw, 48px) clamp(32px, 5vw, 64px)",
              maxWidth: 640,
              width: "100%",
              boxShadow:
                "0 16px 64px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            }}
          >
            <Flex vertical align="center" gap={20}>
              {/* Accent tag */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Space
                  style={{
                    background: "rgba(151, 225, 62, 0.2)",
                    border: "1px solid rgba(151, 225, 62, 0.4)",
                    borderRadius: 99,
                    padding: "4px 20px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#97e13e",
                      display: "inline-block",
                      boxShadow: "0 0 8px rgba(151, 225, 62, 0.6)",
                    }}
                  />
                  <span
                    style={{
                      color: "white",
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    New Season
                  </span>
                </Space>
              </motion.div>

              <Title
                level={1}
                style={{
                  color: "white",
                  margin: 0,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.04em",
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  lineHeight: 1,
                  textAlign: "center",
                  textShadow: "0 2px 20px rgba(0,0,0,0.2)",
                }}
              >
                Just Dropped
              </Title>

              <Paragraph
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  fontWeight: 500,
                  maxWidth: 380,
                  margin: 0,
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Discover the latest arrivals engineered for style and
                performance.
              </Paragraph>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Link href="/collections/products" passHref legacyBehavior>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                    style={{
                      padding: "0 40px",
                      height: 56,
                      fontSize: 13,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      border: "none",
                      boxShadow: "0 8px 32px rgba(151, 225, 62, 0.4)",
                    }}
                  >
                    Shop Now
                  </Button>
                </Link>
              </motion.div>
            </Flex>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
