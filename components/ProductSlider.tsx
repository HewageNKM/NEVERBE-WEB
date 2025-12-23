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
 * ProductSlider - NEVERBE Performance Gear Style
 * Consolidates slider logic with brand-specific motion and typography.
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
      className={`w-full max-w-content mx-auto px-4 md:px-8 animate-fade ${className}`}
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-muted mt-2 max-w-md font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6">
          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-12 h-12 rounded-full border border-border-dark flex items-center justify-center text-primary hover:bg-accent hover:text-dark hover:border-accent hover:shadow-hover transition-all duration-300"
              aria-label="Previous slide"
            >
              <IoChevronBack size={20} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-12 h-12 rounded-full border border-border-dark flex items-center justify-center text-primary hover:bg-accent hover:text-dark hover:border-accent hover:shadow-hover transition-all duration-300"
              aria-label="Next slide"
            >
              <IoChevronForward size={20} />
            </button>
          </div>

          {/* View All Link */}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-primary hover:text-accent group transition-colors"
            >
              View All
              <span className="bg-dark text-inverse p-1.5 rounded-full group-hover:bg-accent group-hover:text-dark transition-all">
                <IoArrowForward size={14} />
              </span>
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
        slidesPerView={1.3} // Slightly more reveal on mobile to encourage swiping
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4 },
          1440: { slidesPerView: 4.2 },
        }}
        className="pb-12!"
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id}>
            <ItemCard item={item} priority={index < 4} />
          </SwiperSlide>
        ))}

        {/* Mobile-Only "View All" Slide */}
        {viewAllHref && (
          <SwiperSlide className="md:hidden">
            <Link
              href={viewAllHref}
              className="flex flex-col w-full h-full group"
            >
              <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-2 border-2 border-dashed border-border-primary flex flex-col items-center justify-center rounded-sm">
                <div className="w-16 h-16 rounded-full bg-dark text-accent flex items-center justify-center mb-4 shadow-custom group-active:scale-90 transition-all">
                  <IoArrowForward size={32} />
                </div>
                <span className="font-display font-black uppercase italic tracking-tighter text-lg">
                  Explore All
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">
                  {items.length}+ Items Available
                </span>
              </div>
              <div className="pt-4 pb-6 px-1" />
            </Link>
          </SwiperSlide>
        )}
      </Swiper>
    </section>
  );
};

export default ProductSlider;
