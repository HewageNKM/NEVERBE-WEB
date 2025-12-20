"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ItemCard from "@/components/ItemCard";
import { Product } from "@/interfaces/Product";

interface ProductSliderProps {
  title: string;
  items: Product[];
  className?: string;
}

/**
 * Shared ProductSlider component
 * Consolidates duplicate slider logic from NewArrivals, PopularProducts, and similar components
 */
const ProductSlider: React.FC<ProductSliderProps> = ({
  title,
  items,
  className = "",
}) => {
  if (!items || items.length === 0) return null;

  return (
    <section
      className={`w-full max-w-[1440px] mx-auto px-4 md:px-8 ${className}`}
    >
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          {title}
        </h2>
      </div>

      <Swiper
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
      </Swiper>
    </section>
  );
};

export default ProductSlider;
