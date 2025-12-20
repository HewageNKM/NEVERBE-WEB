"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import ItemCard from "@/components/ItemCard";
import { Product } from "@/interfaces/Product";
import Link from "next/link";
import {
  IoArrowForward,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

interface ProductSliderProps {
  title: string;
  items: Product[];
  subtitle?: string;
  viewAllHref?: string;
  className?: string;
}

/**
 * Shared ProductSlider component
 * Consolidates duplicate slider logic from NewArrivals, PopularProducts, and similar components
 * Features: Navigation arrows, View All link, optional subtitle
 */
const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  items,
  subtitle,
  viewAllHref,
  className = "",
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <section
      className={`w-full max-w-[1440px] mx-auto px-4 md:px-8 ${className}`}
    >
      {/* Header with Title, Subtitle, Navigation Arrows, and View All */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 max-w-md">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation Arrows - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
              aria-label="Previous slide"
            >
              <IoChevronBack size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
              aria-label="Next slide"
            >
              <IoChevronForward size={18} />
            </button>
          </div>

          {/* View All Link - Hidden on mobile */}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="hidden md:flex items-center gap-1 text-sm font-bold uppercase tracking-wider hover:underline ml-4"
            >
              View All <IoArrowForward />
            </Link>
          )}
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={20}
        slidesPerView={1.5}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4.2 },
        }}
        className="!pb-10"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id}>
            <ItemCard item={item} priority={index < 4} />
          </SwiperSlide>
        ))}

        {/* Mobile "View All" Card - matches ItemCard structure */}
        {viewAllHref && (
          <SwiperSlide className="md:hidden">
            <Link href={viewAllHref} className="flex flex-col w-full bg-white">
              {/* Match ItemCard image container aspect ratio */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-50 border border-gray-100 flex flex-col items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mb-4">
                  <IoArrowForward size={28} />
                </span>
                <span className="font-bold uppercase tracking-widest text-sm">
                  View All
                </span>
              </div>
              {/* Match ItemCard detail area spacing */}
              <div className="pt-3 pb-6 px-1" />
            </Link>
          </SwiperSlide>
        )}
      </Swiper>
    </section>
  );
};

export default ProductSlider;
