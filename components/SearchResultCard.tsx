"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces/Product";
import { usePromotionsContext } from "@/components/PromotionsProvider";

interface SearchResultCardProps {
  item: Product;
  onClick: () => void;
  variant?: "list" | "card"; // 'list' for mobile menu, 'card' for desktop grid
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  item,
  onClick,
  variant = "list",
}) => {
  const { getPromotionForProduct } = usePromotionsContext();
  const activePromo = getPromotionForProduct(item.id);

  // Price Calculation (Preserved Logic)
  let finalPrice =
    item.discount > 0
      ? Math.round(
          (item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10
        ) * 10
      : Math.round(item.sellingPrice);

  if (activePromo?.actions?.[0]?.value) {
    if (activePromo.type === "PERCENTAGE") {
      finalPrice =
        Math.round(
          (finalPrice * (100 - activePromo.actions[0].value)) / 100 / 10
        ) * 10;
    } else if (activePromo.type === "FIXED") {
      finalPrice = Math.max(0, finalPrice - activePromo.actions[0].value);
    }
  }

  const hasDiscount = item.discount > 0 || activePromo;

  // Grid / Card layout for desktop search
  if (variant === "card") {
    return (
      <Link
        href={`/collections/products/${item.id}`}
        onClick={onClick}
        className="group flex flex-col bg-white hover:bg-[#fafafa] transition-all cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-[#f6f6f6] overflow-hidden">
          <Image
            src={item.thumbnail.url}
            alt={item.name}
            fill
            className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
          {/* Promo Badge */}
          {activePromo && (
            <span className="absolute top-2 left-2 bg-[#111] text-white text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
              {activePromo.type === "BOGO" ? "BOGO" : "Promo"}
            </span>
          )}
          {/* Discount Badge */}
          {item.discount > 0 && !activePromo && (
            <span className="absolute top-2 left-2 bg-[#b22222] text-white text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
              -{item.discount}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="text-[13px] font-medium text-[#111] leading-tight line-clamp-2 group-hover:underline">
            {item.name}
          </h3>
          <p className="text-[11px] text-[#707072] mt-1 capitalize">
            {item.tags?.[0] || "Footwear"}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`text-[13px] font-medium ${
                hasDiscount ? "text-[#b22222]" : "text-[#111]"
              }`}
            >
              Rs. {finalPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-[#707072] line-through">
                Rs. {item.sellingPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // List layout for mobile menu search
  return (
    <Link
      href={`/collections/products/${item.id}`}
      onClick={onClick}
      className="group flex items-center gap-5 p-5 hover:bg-[#f5f5f5] transition-all cursor-pointer w-full"
    >
      {/* Precision Image Box */}
      <div className="relative w-20 h-20 bg-[#f6f6f6] rounded-sm overflow-hidden shrink-0">
        <Image
          src={item.thumbnail.url}
          alt={item.name}
          width={100}
          height={100}
          className="object-cover w-full h-full mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {activePromo && (
            <span className="bg-[#111] text-white text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
              {activePromo.type === "BOGO" ? "BOGO" : "Promo"}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] font-medium text-[#111] tracking-tight leading-tight group-hover:underline">
          {item.name}
        </h2>
        <p className="text-[13px] text-[#707072] font-normal mt-0.5">
          {item.tags?.[0] || "Footwear"}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-[15px] font-medium ${
              hasDiscount ? "text-[#b22222]" : "text-[#111]"
            }`}
          >
            Rs. {finalPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[13px] text-[#707072] line-through">
              Rs. {item.sellingPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
export default SearchResultCard;
