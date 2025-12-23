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
    <section className="w-full max-w-content mx-auto py-20 px-4 md:px-12">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-xl md:text-2xl font-display font-black uppercase italic tracking-tighter text-primary">
          Recently Viewed
        </h2>

        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full border border-default bg-surface flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all"
            aria-label="Previous items"
          >
            <IoChevronBack size={18} />
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full border border-default bg-surface flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all"
            aria-label="Next items"
          >
            <IoChevronForward size={18} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        onInit={handleInit}
        spaceBetween={16}
        slidesPerView={1.3}
        breakpoints={{
          768: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4.2 },
        }}
        className="overflow-visible!"
      >
        {displayItems.map((product) => (
          <SwiperSlide key={product.id}>
            <ItemCard item={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default RecentlyViewedSection;
