"use client";
import React from 'react';
import BrandCard from "@/app/components/BrandCard";
import { brands } from '@/constants';

const Brands = () => {
  return (
    <section 
      className="w-full py-12 bg-slate-100" 
      aria-labelledby="brands-section"
    >
      <h2 
        id="brands-section"
        className="text-center font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-8"
      >
        Popular Brands
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        <ul 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-center items-center"
          role="list"
        >
          {brands.map((brand) => (
            <li key={brand.id} className="flex justify-center">
              <BrandCard 
                brand={brand.name} 
                url={brand.url} 
                image={brand.image} 
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Brands;
