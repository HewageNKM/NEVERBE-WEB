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
  currentProductId?: string; // To exclude the currently viewing product from the list if needed
}

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

  // Filter out the current product if passed (optional, often better to show it in history too, but common to hide)
  // Let's keep it simply showing everything or filtering current if desired.
  // Standard pattern: usually you want to see history even if it includes current, OR filter it.
  // Let's filter it out if provided, so we don't duplicate the main hero product immediately below it.
  const displayItems = currentProductId
    ? recentlyViewed.filter((p) => p.id !== currentProductId)
    : recentlyViewed;

  if (displayItems.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Recently Viewed
          </h2>

          {/* Minimal Nav Buttons */}
          <div className="flex gap-2">
            <button
              ref={prevRef}
              className="p-2 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-30"
            >
              <IoChevronBack size={18} />
            </button>
            <button
              ref={nextRef}
              className="p-2 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-30"
            >
              <IoChevronForward size={18} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          onInit={handleInit}
          spaceBetween={20}
          slidesPerView={1.5}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5.2 },
          }}
          className="!pb-10"
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
