"use client";
import React from "react";
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

const SimilarProducts = ({ items }: { items: Item[] }) => {
  return (
    <section className="w-full my-10">
      <h2 className="text-xl md:text-2xl font-display font-bold text-gray-800 mb-6">Similar Products</h2>

      {items.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {items.map((item) => (
            <div key={item.itemId} className="min-w-[200px] flex-shrink-0">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState heading="No similar products available!" />
      )}
    </section>
  );
};

export default SimilarProducts;
