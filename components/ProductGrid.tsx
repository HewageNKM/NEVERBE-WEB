"use client";
import React from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import ComponentLoader from "@/components/ComponentLoader";
import { Product } from "@/interfaces/Product";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  emptyHeading?: string;
  emptySubHeading?: string;
}

const ProductGrid = ({
  products,
  loading,
  emptyHeading = "No Products Found",
  emptySubHeading,
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className="h-[60vh] relative">
        <ComponentLoader />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pt-20">
        <EmptyState heading={emptyHeading} subHeading={emptySubHeading} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 animate-fade-in">
      {products.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default ProductGrid;
