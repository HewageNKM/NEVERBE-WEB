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
    <section className="w-full max-w-content mx-auto px-4 md:px-8 py-10 md:py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary">
            Trending Bundles
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md">
            Save big with our exclusive combo deals. Buy more, pay less.
          </p>
        </div>

        <Link
          href="/collections/combos"
          className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors border-b-2 border-transparent hover:border-accent pb-1"
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
            className="flex flex-col items-center justify-center h-full min-h-[300px] bg-surface-2 border border-default rounded-2xl hover:border-accent transition-all"
          >
            <span className="w-14 h-14 rounded-full bg-accent text-dark flex items-center justify-center mb-4 shadow-custom">
              <IoArrowForward size={24} />
            </span>
            <span className="font-display font-black uppercase tracking-widest text-sm text-primary">
              View All Bundles
            </span>
          </Link>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default TrendingBundles;
