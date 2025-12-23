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

  // Shared Badge Component for Consistency
  const Badge = ({
    children,
    isPromo = false,
  }: {
    children: React.ReactNode;
    isPromo?: boolean;
  }) => (
    <span
      className={`absolute top-2 left-2 px-2 py-1 text-[9px] font-display font-black uppercase italic tracking-tighter shadow-custom z-10 ${
        isPromo ? "bg-accent text-dark" : "bg-dark text-inverse"
      }`}
    >
      {children}
    </span>
  );

  // --- VARIANT: CARD (Desktop Grid Search) ---
  if (variant === "card") {
    return (
      <Link
        href={`/collections/products/${item.id}`}
        onClick={onClick}
        className="group flex flex-col bg-surface hover:bg-surface-2 transition-all duration-300 cursor-pointer h-full border border-transparent hover:border-default hover:shadow-hover"
      >
        {/* Product Image */}
        <div className="relative aspect-square bg-surface-2 overflow-hidden">
          <Image
            src={item.thumbnail.url}
            alt={item.name}
            fill
            className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
          />

          {/* Branded Badges */}
          {activePromo ? (
            <Badge isPromo>
              {activePromo.type === "BOGO" ? "BOGO" : "Promo"}
            </Badge>
          ) : item.discount > 0 ? (
            <Badge isPromo>-{item.discount}%</Badge>
          ) : (
            <Badge>New</Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-base font-display font-bold text-primary leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-muted mt-1 font-bold uppercase tracking-widest">
            {item.category?.replace("-", " ") || "Performance Gear"}
          </p>

          <div className="mt-auto pt-3 flex items-baseline gap-2 flex-wrap">
            <span
              className={`text-md font-black italic tracking-tighter ${
                hasDiscount ? "text-success" : "text-primary"
              }`}
            >
              Rs. {finalPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through decoration-border-dark">
                Rs. {item.sellingPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // --- VARIANT: LIST (Mobile Menu / Compact Search) ---
  return (
    <Link
      href={`/collections/products/${item.id}`}
      onClick={onClick}
      className="group flex items-center gap-4 p-4 hover:bg-surface-3 transition-all cursor-pointer w-full border-b border-default last:border-none"
    >
      {/* Precision Image Box */}
      <div className="relative w-20 h-20 bg-surface-2 rounded-lg overflow-hidden shrink-0 border border-default">
        <Image
          src={item.thumbnail.url}
          alt={item.name}
          width={100}
          height={100}
          className="object-cover w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-base font-display font-black uppercase italic tracking-tighter text-primary leading-tight truncate group-hover:text-accent transition-colors">
            {item.name}
          </h2>
          {activePromo && (
            <span className="shrink-0 bg-accent text-dark text-[8px] font-black italic px-1.5 py-0.5 shadow-sm">
              PROMO
            </span>
          )}
        </div>

        <p className="text-xs text-muted font-bold uppercase tracking-wider mt-0.5">
          {item.category?.replace("-", " ") || "Gear"}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <span
            className={`text-base font-black italic tracking-tighter ${
              hasDiscount ? "text-success" : "text-primary"
            }`}
          >
            Rs. {finalPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through">
              Rs. {item.sellingPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
