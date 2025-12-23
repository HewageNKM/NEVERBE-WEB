"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ComboProduct } from "@/interfaces/ComboProduct";

interface ComboCardProps {
  combo: ComboProduct & { previewThumbnail?: string };
}

/**
 * ComboCard - NEVERBE Performance Style
 * Bundle cards with branded badges and dynamic pricing display.
 */
const ComboCard: React.FC<ComboCardProps> = ({ combo }) => {
  const savings = combo.originalPrice - combo.comboPrice;
  const savingsPercent = Math.round((savings / combo.originalPrice) * 100);

  // Get combo type label - using brand accent for all badges
  const getTypeLabel = () => {
    switch (combo.type) {
      case "BOGO":
        return "Buy & Get Free";
      case "MULTI_BUY":
        return `Buy ${combo.buyQuantity} Save More`;
      case "BUNDLE":
      default:
        return "Bundle Deal";
    }
  };

  const hasSavings = savings > 0;

  return (
    <Link
      href={`/collections/combos/${combo.id}`}
      className="group block bg-transparent"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 bg-surface-2 overflow-hidden mb-4">
        {combo.previewThumbnail || combo.thumbnail?.url ? (
          <Image
            src={combo.previewThumbnail || combo.thumbnail?.url || ""}
            alt={combo.name}
            fill
            className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Badges - Top Left - Using brand accent */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Type Badge */}
          <div className="bg-accent text-dark text-[10px] font-display font-black uppercase italic tracking-tighter px-3 py-1.5 shadow-custom">
            {getTypeLabel()}
          </div>

          {/* Savings Badge */}
          {hasSavings && (
            <div className="bg-dark text-accent text-[10px] font-black uppercase tracking-widest px-3 py-1.5 shadow-custom">
              Save {savingsPercent}%
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-base font-display font-bold text-primary leading-tight mb-1 group-hover:text-accent transition-colors uppercase tracking-tight">
            {combo.name}
          </h3>
          <p className="text-sm text-muted font-medium mb-2">
            {combo.items?.length || 0} Piece Bundle
          </p>

          {combo.type === "BOGO" && (
            <p className="text-sm text-accent font-black uppercase tracking-tight italic">
              Buy {combo.buyQuantity}, Get {combo.getQuantity} Free
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-md font-display font-black text-primary italic tracking-tighter">
            Rs. {combo.comboPrice.toLocaleString()}
          </div>
          {hasSavings && (
            <div className="text-sm text-muted line-through decoration-border-dark">
              Rs. {combo.originalPrice.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ComboCard;
