"use client";
import React from 'react';
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

const NewArrivals = ({ arrivals }: { arrivals: Item[] }) => {
  return (
    <section className="w-full my-16">
      <div className="lg:px-24 px-4 w-full">
        {/* Header */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
            New Arrivals
          </h2>
          <h3 className="text-primary text-lg md:text-xl mt-2 font-medium">
            Check out our latest products
          </h3>
        </div>

        {/* Products */}
        <div className="mt-10">
          {arrivals.length > 0 ? (
            <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {arrivals.map((item: Item) => (
                <li
                  key={item.itemId}
                  className="transition-transform duration-300 hover:scale-105"
                >
                  <ItemCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8">
              <EmptyState heading="No new arrivals" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
