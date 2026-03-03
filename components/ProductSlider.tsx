"use client";

import React, { useRef } from "react";
import { Carousel, Typography, Button, Flex } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import ItemCard from "@/components/ItemCard";
import { Product } from "@/interfaces/Product";
import Link from "next/link";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

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
  const carouselRef = useRef<CarouselRef>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className={`w-full max-w-content mx-auto px-4 md:px-8 ${className}`}>
      {/* Header Area */}
      <Flex align="center" justify="space-between" className="mb-8 gap-4">
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

        <Flex align="center" gap={12}>
          {/* Desktop Navigation Arrows */}
          <Flex align="center" gap={8} className="hidden md:flex ml-auto">
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              size="middle"
              className=" hover:border-[#97e13e]! hover:text-[#97e13e]!"
              onClick={() => carouselRef.current?.prev()}
            />
            <Button
              shape="circle"
              icon={<RightOutlined />}
              size="middle"
              className=" hover:border-[#97e13e]! hover:text-[#97e13e]!"
              onClick={() => carouselRef.current?.next()}
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
                className="hover:text-[#97e13e]!"
              >
                View All
              </Button>
            </Link>
          )}
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
            breakpoint: 1440,
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
        {items.map((item, index) => (
          <div key={item.id} className="px-2 pb-4">
            <ItemCard item={item} priority={index < 4} />
          </div>
        ))}

        {/* Mobile-Only "Explore All" Slide */}
        {viewAllHref && (
          <div className="px-2 md:hidden h-full">
            <Link
              href={viewAllHref}
              className="apple-glass flex flex-col items-center justify-center w-full aspect-4/5 rounded-[24px] group transition-all duration-300"
              style={{
                border: "2px dashed rgba(151, 225, 62, 0.25)",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #97e13e 0%, #7bc922 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  boxShadow: "0 8px 24px rgba(151, 225, 62, 0.35)",
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
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default ProductSlider;
