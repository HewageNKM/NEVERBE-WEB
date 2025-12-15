"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Promotion } from "@/services/WebsiteService";

interface PromotionalAdsProps {
  promotions: Promotion[];
}

/**
 * Promotional Ads Banner Grid
 * Displays promotional banners from Firestore website_ads collection
 */
const PromotionalAds: React.FC<PromotionalAdsProps> = ({ promotions }) => {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="w-full py-12 px-4 md:px-8 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
          Featured Offers
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-medium uppercase tracking-wide">
          Exclusive deals just for you
        </p>
      </div>

      <div
        className={`grid gap-4 ${
          promotions.length === 1
            ? "grid-cols-1"
            : promotions.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={promo.link}
              className="group relative block overflow-hidden bg-gray-100 aspect-[16/9] md:aspect-[2/1]"
            >
              <Image
                src={promo.url}
                alt={promo.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-tight">
                  {promo.title}
                </h3>
                <span className="inline-flex items-center gap-2 mt-2 text-white/80 text-sm font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                  Shop Now
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromotionalAds;
