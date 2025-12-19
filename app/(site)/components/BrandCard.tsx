"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandCardProps {
  brand: string;
  url: string;
  image?: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, url, image }) => {
  return (
    <Link
      href={url}
      className="group flex items-center justify-center p-4 md:p-6 transition-all duration-300 transform lg:hover:scale-105"
    >
      <div className="relative flex items-center justify-center rounded-lg overflow-hidden p-4 bg-white shadow-lg hover:shadow-2xl transition-transform duration-500 group lg:hover:scale-110">
        {image ? (
          <Image
            width={500}
            height={250}
            src={image}
            alt={`${brand} Logo`}
            className="object-contain w-48 h-32 transition-all duration-500 lg:group-hover:opacity-90"
          />
        ) : (
          <div className="w-48 h-32 flex items-center justify-center text-gray-400 text-sm">
            {brand}
          </div>
        )}
      </div>
    </Link>
  );
};

export default BrandCard;
