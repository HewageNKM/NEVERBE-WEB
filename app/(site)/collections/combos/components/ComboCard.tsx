"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ComboProduct } from "@/interfaces/ComboProduct";

interface ComboCardProps {
  combo: ComboProduct & { previewThumbnail?: string };
}

const ComboCard: React.FC<ComboCardProps> = ({ combo }) => {
  const savings = combo.originalPrice - combo.comboPrice;
  const savingsPercent = Math.round((savings / combo.originalPrice) * 100);

  // Get combo type label and color
  const getTypeStyles = () => {
    switch (combo.type) {
      case "BOGO":
        return {
          label: "Buy & Get Free",
          bg: "bg-green-500",
        };
      case "MULTI_BUY":
        return {
          label: `Buy ${combo.buyQuantity} Save More`,
          bg: "bg-blue-500",
        };
      case "BUNDLE":
      default:
        return {
          label: "Bundle Deal",
          bg: "bg-orange-500",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Link
      href={`/collections/combos/${combo.id}`}
      className="group block bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#f6f6f6] overflow-hidden">
        {combo.previewThumbnail || combo.thumbnail?.url ? (
          <Image
            src={combo.previewThumbnail || combo.thumbnail?.url || ""}
            alt={combo.name}
            fill
            className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-6xl">📦</span>
          </div>
        )}

        {/* Type Badge */}
        <div
          className={`absolute top-3 left-3 ${typeStyles.bg} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm`}
        >
          {typeStyles.label}
        </div>

        {/* Savings Badge */}
        <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-sm">
          Save {savingsPercent}%
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg uppercase tracking-tight line-clamp-2 group-hover:underline">
          {combo.name}
        </h3>

        {combo.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {combo.description}
          </p>
        )}

        {/* Items Count */}
        <div className="text-[11px] text-gray-400 uppercase tracking-wide mt-2">
          {combo.items?.length || 0} items included
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-black">
              Rs. {combo.comboPrice.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 line-through ml-2">
              Rs. {combo.originalPrice.toLocaleString()}
            </span>
          </div>
          <div className="text-green-600 font-bold text-sm">
            Save Rs. {savings.toLocaleString()}
          </div>
        </div>

        {/* BOGO specific info */}
        {combo.type === "BOGO" && combo.buyQuantity && combo.getQuantity && (
          <div className="mt-3 text-sm text-green-600 font-bold">
            Buy {combo.buyQuantity}, Get {combo.getQuantity}{" "}
            {combo.getDiscount === 100
              ? "FREE"
              : `at ${combo.getDiscount}% off`}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ComboCard;
