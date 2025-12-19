"use client";

import React, { useEffect } from "react";
import { Product } from "@/interfaces/Product";
import { useRecentlyViewed } from "@/components/RecentlyViewedProvider";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";

interface RecentlyViewedTrackerProps {
  product: Product;
}

const RecentlyViewedTracker: React.FC<RecentlyViewedTrackerProps> = ({
  product,
}) => {
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  return <RecentlyViewedSection currentProductId={product.id} />;
};

export default RecentlyViewedTracker;
