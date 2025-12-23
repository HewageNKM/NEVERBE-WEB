"use client";

import React, { useRef } from "react";
import { useRecentlyViewed } from "@/components/RecentlyViewedProvider";
import ItemCard from "@/components/ItemCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "swiper/css";

interface RecentlyViewedSectionProps {
  currentProductId?: string;
}

/**
 * RecentlyViewedSection - NEVERBE Brand Style
 * A technical, clean history slider with brand-aligned typography and motion.
 */
const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  currentProductId,
}) => {
  const { recentlyViewed } = useRecentlyViewed();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const handleInit = (swiper: SwiperType) => {
    if (
      swiper.params.navigation &&
      typeof swiper.params.navigation !== "boolean"
    ) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  };

  const displayItems = currentProductId
    ? recentlyViewed.filter((p) => p.id !== currentProductId)
    : recentlyViewed;

  if (displayItems.length === 0) return null;

  return (
    <section className="w-full py-16 md:py-24 bg-surface-2 border-t border-default animate-fade">
      <div className="w-full max-w-content mx-auto px-4 md:px-8">
        {/* Header Area */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent italic">
              Your Blueprint
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary">
              Recently Viewed
            </h2>
          </div>

          {/* Branded Navigation Arrows */}
          <div className="flex gap-3">
            <button
              ref={prevRef}
              className="group w-12 h-12 rounded-full border border-border-dark flex items-center justify-center text-primary hover:bg-accent hover:text-dark hover:border-accent transition-all duration-300 shadow-sm hover:shadow-hover disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Previous items"
            >
              <IoChevronBack
                size={20}
                className="transition-transform group-hover:-translate-x-0.5"
              />
            </button>
            <button
              ref={nextRef}
              className="group w-12 h-12 rounded-full border border-border-dark flex items-center justify-center text-primary hover:bg-accent hover:text-dark hover:border-accent transition-all duration-300 shadow-sm hover:shadow-hover disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Next items"
            >
              <IoChevronForward
                size={20}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        {/* Swiper Container */}
        <Swiper
          modules={[Navigation]}
          onInit={handleInit}
          spaceBetween={24}
          slidesPerView={1.3}
          breakpoints={{
            640: { slidesPerView: 2.3 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5.2 },
            1536: { slidesPerView: 6.2 }, // Higher density for the 1920px width
          }}
          className="!pb-12"
        >
          {displayItems.map((product) => (
            <SwiperSlide key={product.id}>
              <ItemCard item={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
