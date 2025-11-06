"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/interfaces/Product";
import Link from "next/link";

interface SearchResultCardProps {
  item: Product;
  onClick: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ item, onClick }) => {
  const router = useRouter();

  const discountedPrice =
    item.discount > 0
      ? Math.round((item.sellingPrice - (item.discount * item.sellingPrice) / 100) / 10) * 10
      : item.sellingPrice;

  return (
    <Link href={`/collections/products/${item.id.toLowerCase()}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
        <Image
          src={item.thumbnail.url}
          alt={item.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
        {item.discount > 0 && (
          <span className="absolute top-1 left-1 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded font-semibold">
            -{item.discount}%
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center flex-1 overflow-hidden">
        <h2 className="font-semibold font-display text-sm sm:text-base">{item.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-900 font-bold text-sm sm:text-base">
            Rs {discountedPrice.toFixed(2)}
          </span>
          {item.discount > 0 && (
            <span className="text-gray-400 text-xs sm:text-sm line-through">
              Rs {item.marketPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
