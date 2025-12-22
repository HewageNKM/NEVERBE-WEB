"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/interfaces/Product";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import {
  calculateFinalPrice,
  hasDiscount as checkHasDiscount,
} from "@/utils/pricing";

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

  // Use shared pricing utilities
  const finalPrice = calculateFinalPrice(item, activePromo);
  const hasDiscount = checkHasDiscount(item, activePromo);

  // Grid / Card layout for desktop search
  if (variant === "card") {
    return (
      <Link
        href={`/collections/products/${item.id}`}
        onClick={onClick}
        className="group flex flex-col bg-white hover:bg-surface-3 transition-all cursor-pointer"
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-surface-2 overflow-hidden">
          <Image
            src={item.thumbnail.url}
            alt={item.name}
            fill
            className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
          {/* Promo Badge */}
          {activePromo && (
            <span className="absolute top-2 left-2 bg-dark text-white text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
              {activePromo.type === "BOGO" ? "BOGO" : "Promo"}
            </span>
          )}
          {/* Discount Badge */}
          {item.discount > 0 && !activePromo && (
            <span className="absolute top-2 left-2 bg-error text-white text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
              -{item.discount}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="text-[13px] font-medium text-primary leading-tight line-clamp-2 group-hover:underline">
            {item.name}
          </h3>
          <p className="text-[11px] text-secondary mt-1 capitalize">
            {item.tags?.[0] || "Footwear"}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`text-[13px] font-medium ${
                hasDiscount ? "text-error" : "text-primary"
              }`}
            >
              Rs. {finalPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-secondary line-through">
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
      className="group flex items-center gap-5 p-5 hover:bg-surface-2 transition-all cursor-pointer w-full"
    >
      {/* Precision Image Box */}
      <div className="relative w-20 h-20 bg-surface-2 rounded-sm overflow-hidden shrink-0">
        <Image
          src={item.thumbnail.url}
          alt={item.name}
          width={100}
          height={100}
          className="object-cover w-full h-full mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {activePromo && (
            <span className="bg-dark text-white text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
              {activePromo.type === "BOGO" ? "BOGO" : "Promo"}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-[15px] font-medium text-primary tracking-tight leading-tight group-hover:underline">
          {item.name}
        </h2>
        <p className="text-[13px] text-secondary font-normal mt-0.5">
          {item.tags?.[0] || "Footwear"}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-[15px] font-medium ${
              hasDiscount ? "text-error" : "text-primary"
            }`}
          >
            Rs. {finalPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[13px] text-secondary line-through">
              Rs. {item.sellingPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
export default SearchResultCard;
