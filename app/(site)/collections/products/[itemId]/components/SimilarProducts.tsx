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

  if (items.length === 0) return null;

  return (
    <section className="w-full max-w-[1920px] mx-auto py-20 px-4 md:px-12">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-[24px] font-medium text-primary tracking-tight">
          You Might Also Like
        </h2>

        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <IoChevronBack size={20} />
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <IoChevronForward size={20} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        onInit={(s) => {
          if (s.params.navigation && typeof s.params.navigation !== "boolean") {
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
          1280: { slidesPerView: 4.2 },
        }}
        className="overflow-visible!"
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
