"use client";
import React from "react";
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import "swiper/css";
import "swiper/css/navigation";
import { Product } from "@/interfaces/Product";

const SimilarProducts = ({ items }: { items: Product[] }) => {
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

  if (items.length === 0) {
    return <EmptyState heading="No similar products available!" />;
  }

  return (
    <section className="w-full my-10">
      <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6">
        Similar Products
      </h2>

      <div className="max-w-6xl mx-auto md:px-2 relative group">
        {/* Custom Navigation Buttons */}
        <button
          ref={prevRef}
          className="absolute -left-2 md:-left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-custom rounded-full flex items-center justify-center text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50"
          aria-label="Previous slide"
        >
          <BiChevronLeft size={24} />
        </button>
        <button
          ref={nextRef}
          className="absolute -right-2 md:-right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-custom rounded-full flex items-center justify-center text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50"
          aria-label="Next slide"
        >
          <BiChevronRight size={24} />
        </button>

        <Swiper
          modules={[Navigation]}
          onInit={handleInit}
          spaceBetween={16}
          slidesPerView={2} // mobile default
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          loop={items.length > 2} // only loop if more than 2 slide
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <ItemCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SimilarProducts;
