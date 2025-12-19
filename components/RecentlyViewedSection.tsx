"use client";

import React from "react";
import { useRecentlyViewed } from "@/components/RecentlyViewedProvider";
import ItemCard from "@/components/ItemCard";

interface RecentlyViewedSectionProps {
  currentProductId?: string; // To exclude the currently viewing product from the list if needed
}

const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  currentProductId,
}) => {
  const { recentlyViewed } = useRecentlyViewed();

  // Filter out the current product if passed (optional, often better to show it in history too, but common to hide)
  // Let's keep it simply showing everything or filtering current if desired.
  // Standard pattern: usually you want to see history even if it includes current, OR filter it.
  // Let's filter it out if provided, so we don't duplicate the main hero product immediately below it.
  const displayItems = currentProductId
    ? recentlyViewed.filter((p) => p.id !== currentProductId)
    : recentlyViewed;

  if (displayItems.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Recently Viewed
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-4 md:gap-x-6">
          {displayItems.slice(0, 5).map((product) => (
            <ItemCard key={product.id} item={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
