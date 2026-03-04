"use client";

import React, { useRef } from "react";
import { Typography, Button, Flex } from "antd";
import ItemCard from "@/components/ItemCard";
import { Product } from "@/interfaces/Product";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "swiper/css";

const { Title, Text } = Typography;

interface ProductSliderProps {
  title: string;
  items: Product[];
  subtitle?: string;
  viewAllHref?: string;
  className?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  items,
  subtitle,
  viewAllHref,
  className = "",
}) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!items || items.length === 0) return null;

  return (
    <div
      className={`relative w-full max-w-content mx-auto px-4 md:px-8 py-12 ${className}`}
    >
      {/* Header Area */}
      <Flex
        vertical={false}
        align="center"
        justify="space-between"
        className="mb-10 md:mb-8 gap-4 flex-col md:flex-row"
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
            {subtitle || "Curated For You"}
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
            {title}
          </Title>
        </Flex>
        <Flex
          align="center"
          gap={12}
          className="w-full md:w-auto justify-between md:justify-end"
        >
          {/* Desktop Navigation Arrows */}
          <Flex align="center" gap={8} className="ml-auto">
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

          {/* View All Button */}
          {viewAllHref && (
            <Link href={viewAllHref}>
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
          )}
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
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <ItemCard item={item} />
            </SwiperSlide>
          ))}

          {/* Mobile-Only "Explore All" Slide */}
          {viewAllHref && (
            <SwiperSlide className="px-2 md:hidden">
              <Link
                href={viewAllHref}
                className="apple-glass flex flex-col items-center justify-center w-full aspect-4/5 rounded-[24px] group transition-all duration-300"
                style={{
                  border: "2px dashed rgba(46, 158, 91, 0.25)",
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
                    boxShadow: "0 8px 24px rgba(46, 158, 91, 0.35)",
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
                  }}
                >
                  Explore All
                </Text>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginTop: 4,
                  }}
                >
                  {items.length}+ Items
                </Text>
              </Link>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSlider;
