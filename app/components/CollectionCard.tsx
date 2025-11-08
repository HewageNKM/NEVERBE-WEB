"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CollectionProps {
  url: string;
  label: string;
  image: string;
}

const CollectionCard: React.FC<CollectionProps> = ({ url, label, image }) => {
  console.log(image);
  return (
    <article
      className="
        relative group overflow-hidden rounded-2xl 
        bg-surface/50 backdrop-blur-sm
        transition-all duration-500
        hover:shadow-xl hover:-translate-y-1
      "
    >
      <Link href={url} className="block w-full h-full">
        {/* Image */}
        <div className="relative w-full aspect-3/4">
          <Image
            fill
            src={image}
            alt={`${label} collection`}
            sizes="(max-width: 768px) 100vw, 300px"
            className="
              object-cover 
              transition-transform duration-700 ease-out 
              group-hover:scale-110
            "
            priority
          />
          {/* Overlay */}
          <div
            className="
              absolute inset-0 flex items-center justify-center
              bg-linear-to-t from-black/60 via-black/20 to-transparent
              transition-all duration-500
              group-hover:from-black/70 group-hover:via-black/40
            "
          >
            <h2
              className="
                text-white text-xl text-center md:text-2xl lg:text-3xl font-semibold uppercase 
                tracking-widest drop-shadow-lg 
                transition-all duration-300
                group-hover:scale-105
              "
            >
              {label}
            </h2>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CollectionCard;
