"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";

const BrandsSlider = ({ items }: { items: any[] }) => {
  return (
    <section className="w-full py-16 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          Trusted By You, Sourced By Us
        </p>
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={40}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        className="flex items-center grayscale hover:grayscale-0 transition-all duration-500"
      >
        {items.map((brand) => (
          <SwiperSlide
            key={brand.id}
            className="flex justify-center items-center opacity-60 hover:opacity-100 transition-opacity"
          >
            <Link
              href={`/collections/products?brand=${encodeURIComponent(
                brand.name
              )}`}
            >
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={100}
                  height={60}
                  className="object-contain h-12 w-auto"
                />
              ) : (
                <span className="font-bold text-xl">{brand.name}</span>
              )}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
export default BrandsSlider;
