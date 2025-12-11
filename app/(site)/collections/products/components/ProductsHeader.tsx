"use client";
import React from "react";
import Image from "next/image";
import { DefaultBG } from "@/assets/images";

const ProductsHeader = () => {
  const title = "All Products";

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Smooth Zoom */}
      <figure className="w-full h-48 md:h-88 relative">
        <Image
          src={DefaultBG}
          alt={`${title} Banner`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
      </figure>

      {/* Title Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-display md:text-5xl font-bold tracking-wide text-white drop-shadow-md">
          {title}
        </h1>
        <p className="mt-2 text-gray-200 text-sm md:text-lg tracking-wide">
          Discover our curated collection of {title.toLowerCase()} styles.
        </p>
        <div className="mt-5 h-1.5 w-16 rounded-full bg-primary/80" />
      </div>

      {/* Decorative bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white/80 to-transparent backdrop-blur-[2px]" />
    </section>
  );
};

export default ProductsHeader;
