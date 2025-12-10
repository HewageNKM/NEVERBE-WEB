"use client";

import React from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { motion } from "framer-motion";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import "swiper/css";
import "swiper/css/navigation";
import { Product } from "@/interfaces/Product";

const NewArrivals = ({ arrivals }: { arrivals: Product[] }) => {
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

  if (arrivals.length === 0) {
    return <EmptyState heading="No new arrivals" />;
  }

  return (
    <section className="w-full my-8">
      <div className="lg:px-16 px-2 py-4 w-full">
        {/* Header */}
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
            New Arrivals
          </h2>
          <h3 className="text-primary text-lg md:text-xl mt-2 font-medium">
            Check out our latest products
          </h3>
        </motion.div>

        {/* Swiper Slider */}
        <div className="mt-10 relative group">
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
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            loop={arrivals.length > 2}
          >
            {arrivals.map((item) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  viewport={{ once: true }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ItemCard item={item} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
