"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces/Product";

interface SearchResultCardProps {
  item: Product;
  onClick: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ item, onClick }) => {
  const discountedPrice =
    item.discount > 0
      ? Math.round(
          (item.sellingPrice - (item.discount * item.sellingPrice) / 100) / 10
        ) * 10
      : item.sellingPrice;

  return (
    <Link
      href={`/collections/products/${item.id}`}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl p-3 sm:p-4 transition-all hover:bg-gray-50 hover:shadow-sm border border-transparent hover:border-gray-200 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={item.thumbnail.url}
          alt={item.name}
          width={80}
          height={80}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {item.discount > 0 && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded">
            -{item.discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 overflow-hidden">
        <h2 className="font-semibold text-gray-900 text-sm sm:text-base truncate group-hover:text-primary transition-colors">
          {item.name}
        </h2>

        <div className="flex items-center flex-wrap gap-2 mt-1">
          <span className="text-gray-900 font-bold text-sm sm:text-base">
            Rs {discountedPrice.toFixed(2)}
          </span>

          {item.discount > 0 && (
            <span className="text-gray-400 text-xs sm:text-sm line-through">
              Rs {item.marketPrice.toFixed(2)}
            </span>
          )}
        </div>

        {item.tags?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchResultCard;
