"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandCardProps {
  brand: string;
  url: string;
  image?: string;
}

/**
 * BrandCard - NEVERBE Performance Style
 * Brand logo cards with performance hover effects.
 */
const BrandCard: React.FC<BrandCardProps> = ({ brand, url, image }) => {
  return (
    <Link
      href={url}
      className="group flex items-center justify-center p-4 md:p-6 transition-all duration-300"
    >
      <div className="relative flex items-center justify-center rounded-2xl overflow-hidden p-6 bg-surface-2 border border-default shadow-custom hover:shadow-hover hover:border-accent transition-all duration-500 group lg:hover:scale-105">
        {image ? (
          <Image
            width={500}
            height={250}
            src={image}
            alt={`${brand} Logo`}
            className="object-contain w-48 h-32 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110"
          />
        ) : (
          <div className="w-48 h-32 flex items-center justify-center text-muted font-display font-black uppercase italic tracking-tighter text-lg group-hover:text-accent transition-colors">
            {brand}
          </div>
        )}
      </div>
    </Link>
  );
};

export default BrandCard;
