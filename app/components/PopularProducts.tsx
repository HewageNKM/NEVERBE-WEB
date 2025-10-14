"use client";
import React from 'react';
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { Item } from "@/interfaces";

const PopularProducts = ({ hotItems }: { hotItems: Item[] }) => {
  return (
    <section className="w-full my-16">
      <div className="lg:px-24 px-4 py-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-display md:text-4xl font-bold text-gray-800">
            Popular Products
          </h2>
          <h3 className="text-primary text-lg md:text-xl mt-2 font-medium">
            Check out our best-selling products
          </h3>
        </div>

        {/* Products List */}
        <div className="mt-10 flex justify-center">
          {hotItems.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {hotItems.map((item: Item) => (
                <li
                  key={item.itemId}
                  className="transition-transform duration-300 hover:scale-105"
                >
                  <ItemCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState heading="No hot products available!" />
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
