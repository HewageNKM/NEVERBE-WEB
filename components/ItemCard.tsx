"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { KOKOLogo } from "@/assets/images";
import { Product } from "@/interfaces/Product";

const ItemCard = ({
  item,
  priority = false,
}: {
  item: Product;
  priority?: boolean;
}) => {
  const [outOfStocks, setOutOfStocks] = useState(false);

  useEffect(() => {
    if (!item.variants?.length) {
      setOutOfStocks(true);
    }
  }, [item]);

  const discountedPrice =
    item.discount > 0
      ? Math.round(
          (item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10
        ) * 10
      : Math.round(item.sellingPrice);

  return (
    <article className="group w-full flex flex-col gap-2">
      <Link
        href={`/collections/products/${item?.id}`}
        className="block relative"
      >
        {/* IMAGE CONTAINER - The "Nike" Gray Box */}
        <div className="relative aspect-square w-full bg-[#f6f6f6] rounded-xl overflow-hidden mb-2">
          <Image
            width={600}
            height={600}
            src={item.thumbnail.url}
            alt={item.name}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />

          {/* Badges */}
          {item.discount > 0 && (
            <span className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              -{item.discount}%
            </span>
          )}
          {outOfStocks && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-1 px-1">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-black leading-tight group-hover:text-gray-600 transition-colors line-clamp-2">
              {item.name}
            </h3>
          </div>

          <p className="text-gray-500 text-sm capitalize">
            {item.category?.replace("-", " ") || "Men's Shoes"}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-black font-bold text-lg">
              Rs. {discountedPrice.toLocaleString()}
            </span>
            {item.discount > 0 && (
              <span className="text-gray-400 text-sm line-through decoration-1">
                Rs. {item.marketPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Optional KOKO Text - Small and discrete */}
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
    </article>
  );
};

export default ItemCard;
