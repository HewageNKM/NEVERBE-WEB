"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces/Product";
import { usePromotionsContext } from "@/components/PromotionsProvider";

interface SearchResultCardProps {
  item: Product;
  onClick: () => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  item,
  onClick,
}) => {
  const { getPromotionForProduct } = usePromotionsContext();
  const activePromo = getPromotionForProduct(item.id);

  let finalPrice = item.sellingPrice;
  // 1. Apply Standard Discount (match ItemCard logic)
  if (item.discount > 0) {
    finalPrice =
      Math.round(
        (item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10
      ) * 10;
  } else {
    finalPrice = Math.round(item.sellingPrice);
  }

  // 2. Apply Active Promotion
  if (activePromo) {
    if (activePromo.type === "PERCENTAGE" && activePromo.actions?.[0]?.value) {
      const discountVal = activePromo.actions[0].value;
      finalPrice =
        Math.round((finalPrice * (100 - discountVal)) / 100 / 10) * 10;
    } else if (
      activePromo.type === "FIXED" &&
      activePromo.actions?.[0]?.value
    ) {
      finalPrice = Math.max(0, finalPrice - activePromo.actions[0].value);
    }
  }

  return (
    <Link
      href={`/collections/products/${item.id}`}
      onClick={onClick}
      className="group flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer w-full"
    >
      {/* Product Image - Nike Style Gray Box */}
      <div className="relative w-16 h-16 bg-[#f6f6f6] rounded-md overflow-hidden shrink-0">
        <Image
          src={item.thumbnail.url}
          alt={item.name}
          width={100}
          height={100}
          className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges Container */}
        <div className="absolute top-1 left-1 flex flex-col gap-1 items-start">
          {item.discount > 0 && !activePromo && (
            <span className="bg-white text-black text-[8px] font-bold px-1.5 py-0.5 shadow-sm">
              -{item.discount}%
            </span>
          )}

          {activePromo && (
            <span className="bg-black text-white text-[7px] font-bold px-1.5 py-0.5 shadow-sm uppercase tracking-wide animate-pulse">
              {activePromo.type === "BOGO"
                ? "BOGO"
                : activePromo.type === "PERCENTAGE"
                ? `${activePromo.actions?.[0]?.value}% Off`
                : activePromo.type === "FREE_SHIPPING"
                ? "Free Ship"
                : "Promo"}
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <h2 className="font-bold text-black text-sm uppercase tracking-tight truncate leading-none mt-1">
          {item.name}
        </h2>

        {/* Subtitle / Category Tag */}
        <p className="text-[10px] text-gray-500 font-medium capitalize truncate">
          {item.tags && item.tags.length > 0 ? item.tags[0] : "Men's Footwear"}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`${
              item.discount > 0 || activePromo ? "text-red-600" : "text-black"
            } font-bold text-sm`}
          >
            Rs. {finalPrice.toLocaleString()}
          </span>

          {(item.discount > 0 || activePromo) && (
            <span className="text-gray-400 text-xs line-through decoration-1">
              Rs.{" "}
              {item.marketPrice > item.sellingPrice
                ? item.marketPrice.toLocaleString()
                : item.sellingPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
