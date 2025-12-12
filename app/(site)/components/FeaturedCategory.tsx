"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { collectionList } from "@/constants";
// Ensure collectionList has distinct images.
// If your collectionList is just 3 items, this grid works perfectly.

const FeaturedCategories = () => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8">
        The Essentials
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[600px]">
        {/* First Item - Large */}
        {collectionList[0] && (
          <div className="relative group overflow-hidden rounded-xl md:col-span-1 h-[400px] md:h-full bg-gray-100">
            <Link href={collectionList[0].url} className="block w-full h-full">
              <Image
                src={collectionList[0].image}
                alt={collectionList[0].label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6">
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">
                  {collectionList[0].label}
                </button>
              </div>
            </Link>
          </div>
        )}

        {/* Second & Third Items - Stacked on Mobile, Columns on Desktop */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {collectionList.slice(1, 3).map((item, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-xl h-[300px] md:h-full bg-gray-100"
            >
              <Link href={item.url} className="block w-full h-full">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6">
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">
                    {item.label}
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
