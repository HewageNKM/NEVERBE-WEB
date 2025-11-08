"use client";
import React from "react";
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Product } from "@/interfaces/Product";

const SimilarProducts = ({ items }: { items: Product[] }) => {
  if (items.length === 0) {
    return <EmptyState heading="No similar products available!" />;
  }

  return (
    <section className="w-full my-10">
      <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6">
        Similar Products
      </h2>

      <div className="max-w-6xl mx-auto md:px-2">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={2} // mobile default
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={items.length > 1} // only loop if more than 1 slide
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <ItemCard item={item} />
            </SwiperSlide>
          ))}
          {/* Custom Pagination Container */}
          <div className="custom-pagination mt-3 mb-2 flex justify-center gap-3"></div>
        </Swiper>
      </div>
    </section>
  );
};

export default SimilarProducts;
