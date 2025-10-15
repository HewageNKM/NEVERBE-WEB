"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Item } from "@/interfaces";
import { KOKOLogo } from "@/assets/images";

const ItemCard = ({ item }: { item: Item }) => {
  const [outOfStocks, setOutOfStocks] = useState(false);
  const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");
  const { user } = useSelector((state: RootState) => state.authSlice);

  useEffect(() => {
    if (!item.variants?.length) {
      setOutOfStocks(true);
      setOutOfStocksLabel("Coming Soon");
      return;
    }
    const allOutOfStock = item.variants.every((v) =>
      v.sizes.every((s) => s.stock === 0)
    );
    setOutOfStocks(allOutOfStock);
  }, [item, user]);

  const findRangeOfSizes = () => {
    const sizes = item.variants.flatMap((v) => v.sizes.map((s) => s.size));
    if (!sizes.length) return "N/A";
    return `${Math.min(...sizes)} - ${Math.max(...sizes)}`;
  };

  const discountedPrice =
    item.discount > 0
      ? Math.round(
          (item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10
        ) * 10
      : Math.round(item.sellingPrice);

  return (
    <article className="relative group w-[9rem] sm:w-[12rem] md:w-[15rem] rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link
        href={`/collections/products/${item.itemId.toLowerCase()}`}
        aria-label={`View details for ${item.name}`}
      >
        {/* ---------- IMAGE ---------- */}
        <div className="relative h-[160px] sm:h-[220px] overflow-hidden">
          <Image
            width={300}
            height={300}
            src={item.thumbnail.url}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Manufacturer badge */}
          <span className="absolute top-2 left-2 bg-black/80 text-white text-[0.65rem] sm:text-xs px-2 py-1 rounded-full uppercase tracking-wide">
            {item.manufacturer.replace("-", " ")}
          </span>

          {/* Discount badge */}
          {item.discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[0.65rem] sm:text-xs px-2 py-1 rounded-full">
              -{item.discount}%
            </span>
          )}
        </div>

        {/* ---------- CONTENT ---------- */}
        <div className="p-3 sm:p-4 flex flex-col gap-1">
          <h2 className="text-sm font-display sm:text-base md:text-lg font-semibold line-clamp-1">
            {item.name}
          </h2>

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            <p className="text-gray-400 line-through text-xs sm:text-sm">
              Rs. {item.marketPrice.toFixed(2)}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-base">
              Rs. {discountedPrice.toFixed(2)}
            </p>
          </div>

          {/* KOKO Payment */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-1">
            <p>
              or 3x Rs.{(discountedPrice / 3).toFixed(2)} with
            </p>
            <Image
              alt="KOKO logo"
              src={KOKOLogo}
              width={30}
              height={30}
              className="inline-block"
            />
          </div>

          {/* Colors + Sizes */}
          <div className="flex justify-between items-center text-[0.75rem] sm:text-sm text-gray-600 mt-2">
            <p>{item.variants.length} Colors</p>
            {item.type === "shoes" || item.type === "sandals" ? (
              <p>Size (EU): {findRangeOfSizes()}</p>
            ) : item.type === "accessories" ? (
              <p>
                Sizes:{" "}
                {item.variants?.[0]?.sizes?.length
                  ? item.variants[0].sizes.map((s) => s.size).join(", ")
                  : "N/A"}
              </p>
            ) : null}
          </div>

          {/* Action Link */}
          <div className="mt-3">
            <p className="text-primary font-medium text-sm hover:underline">
              Pick a Color →
            </p>
          </div>
        </div>
      </Link>

      {/* ---------- OUT OF STOCK OVERLAY ---------- */}
      {outOfStocks && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center">
          <h2
            className={`text-white px-4 py-2 rounded-full text-sm sm:text-lg font-semibold tracking-wide ${
              outOfStocksLabel === "Coming Soon"
                ? "bg-yellow-500"
                : "bg-red-600"
            }`}
          >
            {outOfStocksLabel}
          </h2>
        </div>
      )}
    </article>
  );
};

export default ItemCard;
