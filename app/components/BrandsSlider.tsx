"use client";
import React from "react";
import BrandCard from "@/app/components/BrandCard";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const BrandsSlider = ({items}) => {

  return (
    <section className="w-full py-12 bg-slate-100">
      <h2 className="text-center font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
        Popular Brands
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={2} // default mobile
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
        >
          {items.map((brand) => (
            <SwiperSlide key={brand.id} className="flex justify-center">
              <BrandCard brand={brand.name} url={`/collections/brands/${brand.name}`} image={brand.logoUrl} />
            </SwiperSlide>
          ))}

          {/* Custom Pagination Container */}
          <div className="custom-pagination mt-3 mb-2 flex justify-center gap-3"></div>
        </Swiper>
      </div>
    </section>
  );
};

export default BrandsSlider;
