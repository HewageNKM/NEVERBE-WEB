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
    if (!item.variants?.length) {
      setOutOfStocks(true);
    }
  }, [item]);

  const activePromo = getPromotionForProduct(item.id);

  // Use shared pricing utilities
  const discountedPrice = calculateFinalPrice(item, activePromo);
  const hasDiscount = checkHasDiscount(item, activePromo);

  return (
    <article className="group relative flex flex-col w-full bg-surface">
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-2">
        <Link
          href={`/collections/products/${item?.id}`}
          className="cursor-pointer"
        >
          <Image
            width={600}
            height={750}
            src={item.thumbnail.url}
            alt={item.name}
            className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
            priority={priority}
          />
        </Link>

        {/* Nike-Style Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {activePromo ? (
            <span className="text-orange-700 text-[13px] font-medium uppercase tracking-tight">
              {activePromo.type === "BOGO" ? "Buy 1 Get 1" : "Special Offer"}
            </span>
          ) : item.discount > 0 ? (
            <span className="text-orange-700 text-[13px] font-medium">
              {item.discount}% Off
            </span>
          ) : (
            <span className="text-primary text-[13px] font-medium">
              Just In
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {outOfStocks && (
          <div className="absolute inset-0 bg-surface/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-surface px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View - Desktop Overlay (Nike style uses a slide-up or simple reveal) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            openQuickView(item);
          }}
          className="absolute bottom-0 left-0 w-full bg-surface py-4 text-sm font-medium transition-transform translate-y-full group-hover:translate-y-0 duration-300 hidden lg:block border-t border-default"
        >
          Quick Look
        </button>

        {/* Quick View - Mobile (Icon) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            openQuickView(item);
          }}
          className="absolute bottom-3 right-3 lg:hidden w-9 h-9 bg-surface rounded-full shadow-md flex items-center justify-center text-primary active:scale-90 transition-transform"
        >
          <IoEyeOutline size={18} />
        </button>
      </div>

      {/* DETAILS AREA */}
      <div className="flex flex-col pt-3 pb-6 px-1">
        <Link href={`/collections/products/${item?.id}`}>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-[16px] font-medium text-primary leading-tight tracking-tight">
              {item.name}
            </h3>
            <p className="text-[15px] text-secondary font-normal leading-relaxed capitalize">
              {item.category?.replace("-", " ") || "Men's Shoes"}
            </p>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[16px] font-medium ${
                  hasDiscount ? "text-error" : "text-primary"
                }`}
              >
                Rs. {discountedPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-secondary text-[15px] line-through decoration-[0.5px]">
                  Rs.{" "}
                  {item.marketPrice > item.sellingPrice
                    ? item.marketPrice.toLocaleString()
                    : item.sellingPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* KOKO Installments - Minimalist style */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[12px] text-secondary">
                3 installments with
              </span>
              <div className="w-8 h-3 relative grayscale opacity-80 group-hover:grayscale-0 transition-all">
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
