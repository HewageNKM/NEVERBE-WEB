"use client";
import React from "react";
import BrandCard from "@/app/(site)/components/BrandCard";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import "swiper/css";
import "swiper/css/navigation";

// Define an interface for the brand items
const BrandsSlider = ({ items }: { items: any[] }) => {
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

  return (
    <section className="w-full py-12 bg-slate-100">
      <h2 className="text-center font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
        Popular Brands
      </h2>

      <div className="max-w-6xl mx-auto md:px-4 px-2 relative group">
        {/* Custom Navigation Buttons */}
        <button
          ref={prevRef}
          className="absolute -left-2 md:-left-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-custom rounded-full flex items-center justify-center text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50"
          aria-label="Previous slide"
        >
          <BiChevronLeft size={24} />
        </button>
        <button
          ref={nextRef}
          className="absolute -right-2 md:-right-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-custom rounded-full flex items-center justify-center text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary-50"
          aria-label="Next slide"
        >
          <BiChevronRight size={24} />
        </button>

        <Swiper
          modules={[Navigation]}
          onInit={handleInit}
          spaceBetween={24}
          slidesPerView={2} // default mobile
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          loop={true}
        >
          {items.map((brand) => (
            <SwiperSlide key={brand.id} className="flex justify-center">
              <BrandCard
                brand={brand.name}
                url={`/collections/brands/${brand.name}`}
                image={brand.logoUrl}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BrandsSlider;
