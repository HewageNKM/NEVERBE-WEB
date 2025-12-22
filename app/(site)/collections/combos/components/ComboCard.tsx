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
  const hasSavings = savings > 0;

  return (
    <Link
      href={`/collections/combos/${combo.id}`}
      className="group block bg-transparent"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-surface-2 overflow-hidden mb-4">
        {combo.previewThumbnail || combo.thumbnail?.url ? (
          <Image
            src={combo.previewThumbnail || combo.thumbnail?.url || ""}
            alt={combo.name}
            fill
            className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Badges - Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Type Badge */}
          <div
            className={`${typeStyles.bg} text-white text-[11px] font-medium px-3 py-1`}
          >
            {typeStyles.label}
          </div>

          {/* Savings Badge */}
          {hasSavings && (
            <div className="bg-dark text-white text-[11px] font-medium px-3 py-1">
              Save {savingsPercent}%
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-[16px] font-medium text-primary leading-tight mb-1 group-hover:text-secondary transition-colors">
            {combo.name}
          </h3>
          <p className="text-[14px] text-secondary mb-2 line-clamp-1">
            {combo.items?.length || 0} Piece Bundle
          </p>

          {combo.type === "BOGO" && (
            <p className="text-[14px] text-primary font-medium mt-1">
              Buy {combo.buyQuantity}, Get {combo.getQuantity} Free
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-[16px] font-medium text-primary">
            Rs. {combo.comboPrice.toLocaleString()}
          </div>
          {hasSavings && (
            <div className="text-[14px] text-secondary line-through">
              Rs. {combo.originalPrice.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ComboCard;
