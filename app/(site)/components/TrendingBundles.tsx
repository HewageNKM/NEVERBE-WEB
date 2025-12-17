"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ComboCard from "@/app/(site)/collections/combos/components/ComboCard";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

interface TrendingBundlesProps {
  bundles: any[];
}

const TrendingBundles: React.FC<TrendingBundlesProps> = ({ bundles }) => {
  if (!bundles || bundles.length === 0) return null;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Trending Bundles
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            Save big with our exclusive combo deals. Buy more, pay less.
          </p>
        </div>

        <Link
          href="/collections/combos"
          className="hidden md:flex items-center gap-1 text-sm font-bold uppercase tracking-wider hover:underline"
        >
          View All <IoArrowForward />
        </Link>
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-10!"
      >
        {bundles.map((bundle) => (
          <SwiperSlide key={bundle.id}>
            <ComboCard combo={bundle} />
          </SwiperSlide>
        ))}

        {/* Mobile "View All" Card */}
        <SwiperSlide className="md:hidden">
          <Link
            href="/collections/combos"
            className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 border border-gray-100 rounded-lg"
          >
            <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4">
              <IoArrowForward size={24} />
            </span>
            <span className="font-bold uppercase tracking-widest">
              View All Bundles
            </span>
          </Link>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default TrendingBundles;
