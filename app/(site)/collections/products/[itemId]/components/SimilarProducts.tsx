"use client";
import React, { useRef } from "react";
import ItemCard from "@/components/ItemCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "swiper/css";
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

  if (items.length === 0) return null;

  return (
    <section className="w-full max-w-[1440px] mx-auto py-16 border-t border-gray-100">
      <div className="flex justify-between items-end mb-8 px-2">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
          You Might Also Like
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
        }}
        loop={items.length > 4}
        className="!pb-10"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <ItemCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SimilarProducts;
