"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Typography, Flex, Button } from "antd";
import { collectionList } from "@/constants";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { motion } from "framer-motion";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

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

// Reusable category card component used within SwiperSlide
const CategoryCard = ({ item }: { item: any }) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="h-full"
  >
    <Link
      href={item.url}
      className="group relative block aspect-4/5 overflow-hidden rounded-[32px] bg-surface-2 shadow-sm hover:shadow-xl transition-all duration-500 border border-default/50"
    >
      {/* Background Image with optimized scaling */}
      <Image
        src={item.image}
        alt={item.label}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Decorative Overlay */}
      <div className="absolute inset-0 z-10">
        <div
          className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background:
              "linear-gradient(to top, rgba(46,158,91,0.85) 0%, rgba(46,158,91,0.45) 50%, transparent 100%)",
          }}
        />
        {/* Card Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 z-20">
          <Flex align="center" justify="space-between">
            <span className="flex items-center gap-2 bg-white/80 backdrop-blur-md shadow-custom border border-[rgba(46,158,91,0.2)] text-primary-dark px-6 py-2.5 rounded-full font-display font-black text-[10px] uppercase tracking-widest transition-all group-hover:bg-accent! group-hover:text-inverse! group-hover:border-transparent! max-w-[85%] truncate">
              {item.label}
            </span>
            <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400 w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <ArrowRightOutlined style={{ color: "#fff", fontSize: 16 }} />
            </div>
          </Flex>
        </div>
      </div>
    </Link>
  </motion.div>
);

const FeaturedCategories = ({ categories = [] }: { categories?: any[] }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Map dynamic categories to the card format or use fallback if empty
  const displayList = categories.length > 0 
    ? categories.map(cat => ({
        label: cat.name,
        url: `/collections/products?category=${encodeURIComponent(cat.name.toLowerCase())}`,
        image: cat.imageUrl || "/placeholder-collection.png", // Fallback if no image uploaded
      }))
    : collectionList;

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 py-12">
      <Flex
        vertical={false}
        align="end"
        justify="space-between"
        className="mt-6 md:mt-0 swiper-wrapper-fix flex-col md:flex-row gap-6"
      >
        <Flex
          vertical
          gap={4}
          className="text-center md:text-left w-full md:w-auto"
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
            Collections
          </Text>
          <Title
            level={2}
            style={{
              textTransform: "uppercase",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.03em",
              color: "var(--color-primary-dark)",
            }}
          >
            Shop by Category
          </Title>
        </Flex>

        {/* Standardized Swiper Navigation Buttons */}
        <Flex
          align="center"
          gap={12}
          className="w-full md:w-auto justify-between md:justify-end"
        >
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

          <Link href="/collections/products" className="hidden md:block ml-4">
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
                color: "var(--color-primary-dark)",
              }}
              className="hover:text-accent! cursor-pointer"
            >
              View All <ArrowRightOutlined />
            </span>
          </Link>
        </Flex>
      </Flex>

      <div className="relative pb-4 mt-8 md:mt-4">
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
            1280: { slidesPerView: 3.5 },
          }}
          className="overflow-visible!"
        >
          {displayList.map((item) => (
            <SwiperSlide key={item.label}>
              <CategoryCard item={item} />
            </SwiperSlide>
          ))}

          {/* Mobile "View All" Slide */}
          <SwiperSlide className="md:hidden">
            <Link
              href="/collections/products"
              className="flex flex-col items-center justify-center w-full aspect-4/5 rounded-[24px] border border-accent/20 bg-accent/5 transition-all duration-300 group hover:bg-accent/10"
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ArrowRightOutlined style={{ color: "white", fontSize: 20 }} />
              </div>
              <Text strong className="uppercase tracking-widest text-[11px]">
                Explore All
              </Text>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedCategories;
