"use client";

import React, { useRef } from "react";
import { useRecentlyViewed } from "@/components/RecentlyViewedProvider";
import ItemCard from "@/components/ItemCard";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Carousel, Button } from "antd";

interface RecentlyViewedSectionProps {
  currentProductId?: string;
}

/**
 * RecentlyViewedSection - NEVERBE Brand Style
 * A technical, clean history slider with brand-aligned typography and motion.
 */
const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  currentProductId,
}) => {
  const { recentlyViewed } = useRecentlyViewed();
  const carouselRef = useRef<any>(null);

  const displayItems = currentProductId
    ? recentlyViewed.filter((p) => p.id !== currentProductId)
    : recentlyViewed;

  if (displayItems.length === 0) return null;

  return (
    <section className="w-full max-w-content mx-auto py-20 px-4 md:px-12">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter text-primary">
          Recently Viewed
        </h2>

        <div className="flex gap-2">
          <Button
            type="text"
            onClick={() => carouselRef.current?.prev()}
            icon={<IoChevronBack size={18} />}
            className="w-10 h-10 rounded-full border border-default bg-surface flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all"
            aria-label="Previous items"
          />
          <Button
            type="text"
            onClick={() => carouselRef.current?.next()}
            icon={<IoChevronForward size={18} />}
            className="w-10 h-10 rounded-full border border-default bg-surface flex items-center justify-center text-primary hover:border-accent hover:text-accent transition-all"
            aria-label="Next items"
          />
        </div>
      </div>

      <Carousel
        ref={carouselRef}
        dots={false}
        infinite={false}
        slidesToShow={4.2}
        adaptiveHeight
        responsive={[
          {
            breakpoint: 1280,
            settings: {
              slidesToShow: 4.2,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2.2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1.2,
            },
          },
        ]}
      >
        {displayItems.map((product) => (
          <div key={product.id} className="px-2">
            <ItemCard item={product} />
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default RecentlyViewedSection;
