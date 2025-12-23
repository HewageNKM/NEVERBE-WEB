"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { usePromotionsContext } from "@/components/PromotionsProvider";

const PromotionalAds: React.FC = () => {
  const { promotions: systemPromotions } = usePromotionsContext();

  // Map system promotions to UI format
  const allPromotions = systemPromotions
    .filter((p) => p.bannerUrl && p.isActive)
    .map((p) => ({
      id: p.id,
      title: p.name, // Or add bannerTitle specifically
      url: p.bannerUrl!,
      link: "/collections/deals", // Default to deals page for now
      type: "SYSTEM",
    }));

  if (!allPromotions || allPromotions.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-8 max-w-content mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary">
          Featured Offers
        </h2>
        <p className="text-sm text-muted mt-2 font-medium uppercase tracking-wide">
          Exclusive deals just for you
        </p>
      </div>

      <div
        className={`grid gap-4 ${
          allPromotions.length === 1
            ? "grid-cols-1"
            : allPromotions.length === 2
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {allPromotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={promo.link}
              className="group relative block overflow-hidden bg-surface-2 aspect-video md:aspect-2/1 rounded-2xl shadow-custom hover:shadow-hover transition-all"
            >
              <Image
                src={promo.url}
                alt={promo.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-inverse text-xl md:text-2xl font-display font-black uppercase italic tracking-tight">
                  {promo.title}
                </h3>
                <span className="inline-flex items-center gap-2 mt-2 text-inverse/80 text-xs font-black uppercase tracking-widest group-hover:text-accent transition-colors">
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
