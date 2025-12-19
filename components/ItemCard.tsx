"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoEyeOutline } from "react-icons/io5";
import { KOKOLogo } from "@/assets/images";
import { Product } from "@/interfaces/Product";

import { usePromotionsContext } from "@/components/PromotionsProvider";
import { useQuickView } from "@/components/QuickViewProvider";

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

  let finalPrice = item.sellingPrice;
  let originalPrice = item.marketPrice;

  if (item.discount > 0) {
    finalPrice =
      Math.round(
        (item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10
      ) * 10;
  } else {
    finalPrice = Math.round(item.sellingPrice);
  }

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

  const discountedPrice = finalPrice;

  return (
    <>
      <article className="group w-full flex flex-col gap-2">
        <div className="block relative">
          {/* IMAGE CONTAINER */}
          <div className="relative aspect-square w-full bg-[#f6f6f6] rounded-xl overflow-hidden mb-2">
            <Link
              href={`/collections/products/${item?.id}`}
              className="block w-full h-full"
            >
              <Image
                width={600}
                height={600}
                src={item.thumbnail.url}
                alt={item.name}
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                priority={priority}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                {item.discount > 0 && !activePromo && (
                  <span className="bg-white text-black text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    -{item.discount}%
                  </span>
                )}

                {activePromo && (
                  <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide animate-pulse">
                    {activePromo.type === "BOGO"
                      ? "Buy 1 Get 1"
                      : activePromo.type === "PERCENTAGE"
                      ? `${activePromo.actions?.[0]?.value}% Off`
                      : activePromo.type === "FREE_SHIPPING"
                      ? "Free Ship"
                      : "Promo"}
                  </span>
                )}
              </div>

              {outOfStocks && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                    Sold Out
                  </span>
                </div>
              )}
            </Link>

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(item);
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm text-black px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white flex items-center gap-2 z-20"
            >
              <IoEyeOutline size={16} />
              Quick View
            </button>
          </div>

          {/* DETAILS */}
          <Link href={`/collections/products/${item?.id}`} className="block">
            <div className="flex flex-col gap-1 px-1">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold text-black leading-tight group-hover:underline transition-all line-clamp-2">
                  {item.name}
                </h3>
              </div>

              <p className="text-gray-500 text-sm capitalize">
                {item.category?.replace("-", " ") || "Men's Shoes"}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`${
                    item.discount > 0 || activePromo
                      ? "text-red-600"
                      : "text-black"
                  } font-bold text-base md:text-lg`}
                >
                  Rs. {discountedPrice.toLocaleString()}
                </span>
                {(item.discount > 0 || activePromo) && (
                  <span className="text-gray-400 text-sm line-through decoration-1">
                    Rs.{" "}
                    {item.marketPrice > item.sellingPrice
                      ? item.marketPrice.toLocaleString()
                      : item.sellingPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* KOKO Text */}
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <span>or 3 installments with</span>
                <div className="w-8 h-3 relative opacity-60">
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

      {/* Quick View Modal */}
    </>
  );
};

export default ItemCard;
