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
              item.discount > 0 || activePromo
                ? "text-[#b22222]"
                : "text-[#111]"
            }`}
          >
            Rs. {finalPrice.toLocaleString()}
          </span>
          {(item.discount > 0 || activePromo) && (
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
