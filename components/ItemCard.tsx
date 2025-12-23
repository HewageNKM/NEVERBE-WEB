"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
import { KOKOLogo } from "@/assets/images";
import { Product } from "@/interfaces/Product";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import { useQuickView } from "@/components/QuickViewProvider";
import {
  calculateFinalPrice,
  hasDiscount as checkHasDiscount,
} from "@/utils/pricing";

const ItemCard = ({
  item,
  priority = false,
}: {
  item: Product;
  priority?: boolean;
}) => {
  const [outOfStocks, setOutOfStocks] = useState(false);
  const { openQuickView } = useQuickView();
  const { getPromotionForProduct } = usePromotionsContext();

  useEffect(() => {
    if (!item.variants?.length || item.variants.every((v) => v.stock === 0)) {
      setOutOfStocks(true);
    }
  }, [item]);

  const activePromo = getPromotionForProduct(item.id);
  const discountedPrice = calculateFinalPrice(item, activePromo);
  const hasDiscount = checkHasDiscount(item, activePromo);

  return (
    <article className="group relative flex flex-col w-full bg-surface transition-transform duration-500 hover:-translate-y-1">
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-2">
        <Link
          href={`/collections/products/${item?.id}`}
          className="cursor-pointer block h-full w-full"
        >
          <Image
            width={600}
            height={750}
            src={item.thumbnail.url}
            alt={item.name}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
              outOfStocks ? "opacity-60 grayscale" : "group-hover:opacity-95"
            }`}
            priority={priority}
          />
        </Link>

        {/* --- BADGES: Solid Backgrounds for Readability --- */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {activePromo ? (
            // Promo Badge: Vibrant Green Background, Dark Text, Performance Font
            <span className="bg-accent text-primary px-3 py-1.5 text-xs font-display font-black uppercase italic tracking-tighter shadow-sm">
              {activePromo.type === "BOGO" ? "Buy 1 Get 1" : "Special Offer"}
            </span>
          ) : item.discount > 0 ? (
            // Discount Badge: Vibrant Green Background
            <span className="bg-accent text-primary px-3 py-1.5 text-xs font-display font-black uppercase italic tracking-tighter shadow-sm">
              {item.discount}% Off
            </span>
          ) : !outOfStocks ? (
            // "Just In" Badge: Clean Surface Background
            <span className="bg-surface text-primary px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-sm border border-default">
              Just In
            </span>
          ) : null}
        </div>

        {/* Sold Out Overlay - Darker and Themed */}
        {outOfStocks && (
          <div className="absolute inset-0 bg-dark/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-surface-2 px-5 py-2 text-sm font-display font-black uppercase italic tracking-widest text-accent shadow-custom border border-accent">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View - Desktop Slide-up (Hover changes to Green) */}
        {!outOfStocks && (
          <button
            onClick={(e) => {
              e.preventDefault();
              openQuickView(item);
            }}
            className="absolute bottom-0 left-0 w-full bg-surface/95 backdrop-blur-sm py-4 text-sm font-bold uppercase tracking-widest text-primary transition-all translate-y-full group-hover:translate-y-0 duration-300 hidden lg:block border-t border-default hover:bg-accent hover:border-accent hover:text-dark z-10"
          >
            Quick Look
          </button>
        )}

        {/* Quick View - Mobile Icon (Green glow shadow) */}
        {!outOfStocks && (
          <button
            onClick={(e) => {
              e.preventDefault();
              openQuickView(item);
            }}
            className="absolute bottom-3 right-3 lg:hidden w-10 h-10 bg-surface rounded-full shadow-custom flex items-center justify-center text-primary active:scale-90 transition-all hover:text-accent z-10"
          >
            <IoEyeOutline size={20} />
          </button>
        )}
      </div>

      {/* DETAILS AREA */}
      <div className="flex flex-col pt-4 pb-6 px-1">
        <Link href={`/collections/products/${item?.id}`}>
          <div className="flex flex-col gap-1">
            {/* Title using Display Font */}
            <h3 className="text-base font-display font-bold text-primary leading-tight tracking-tight line-clamp-2 group-hover:text-accent transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-muted font-medium leading-relaxed capitalize">
              {item.category?.replace("-", " ") || "Premium Gear"}
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              {/* Price - Using text-success for discounts instead of error red */}
              <span
                className={`text-md font-black ${
                  hasDiscount
                    ? "text-success italic tracking-tight"
                    : "text-primary"
                }`}
              >
                Rs. {discountedPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-muted text-xs line-through decoration-[1px]">
                  Rs.{" "}
                  {item.marketPrice > item.sellingPrice
                    ? item.marketPrice.toLocaleString()
                    : item.sellingPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* KOKO Installments */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted font-medium uppercase tracking-wider">
                3 x Installments with
              </span>
              <div className="w-9 h-4 relative grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <Image
                  src={KOKOLogo}
                  alt="KOKO"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
};

export default ItemCard;
