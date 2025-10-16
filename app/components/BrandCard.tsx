"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandCardProps {
  brand: string;
  url: string;
  image: string;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, url, image }) => {
  return (
    <Link
      href={url}
      className="group flex items-center justify-center p-4 md:p-6 transition-all duration-300 transform lg:hover:scale-105"
    >
      <div className="relative flex items-center justify-center rounded-lg overflow-hidden p-4 bg-white shadow-lg hover:shadow-2xl transition-transform duration-500 group lg:hover:scale-110">
        <Image
          width={500} // increased from 400
          height={250} // maintain aspect ratio
          src={image}
          alt={`${brand} Logo`}
          className="object-contain md:w-[22rem] w-[14rem] md:h-[10rem] h-[5rem] transition-all duration-500 lg:group-hover:opacity-90"
        />
      </div>
    </Link>
  );
};

export default BrandCard;
