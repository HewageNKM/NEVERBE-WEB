"use client";
import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeFromBag } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces/BagItem";

interface BagItemCardProps {
  item: BagItem;
  compact?: boolean; // For checkout summary
  showRemove?: boolean; // Show remove button in compact mode
}

const BagItemCard = ({
  item,
  compact = false,
  showRemove = false,
}: BagItemCardProps) => {
  const dispatch: AppDispatch = useDispatch();
  const totalPrice = item.price * item.quantity;
  const netPrice = totalPrice - item.discount;

  if (compact) {
    // Compact version for checkout summary
    return (
      <div className="flex gap-3 py-2 group">
        <div className="relative w-14 h-14 bg-surface-2 shrink-0 border border-default">
          <Image
            src={item.thumbnail || ""}
            alt={item.name}
            fill
            className="object-cover mix-blend-multiply"
          />
          {item.isComboItem && (
            <span className="absolute -top-1 -left-1 bg-dark text-inverse text-[7px] font-bold px-1">
              Bundle
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase truncate text-primary">
            {item.name}
          </p>
          <p className="text-[10px] text-secondary uppercase">
            Size: {item.size} · Qty: {item.quantity}
          </p>
          {item.isComboItem && item.comboName && (
            <p className="text-[9px] text-muted uppercase mt-0.5">
              {item.comboName}
            </p>
          )}
          {showRemove && (
            <button
              onClick={() => dispatch(removeFromBag(item))}
              className="text-[9px] font-bold uppercase tracking-wide text-muted hover:text-error underline transition-colors mt-1"
            >
              Remove
            </button>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-bold font-mono text-error">
            Rs. {netPrice.toLocaleString()}
          </p>
          {item.discount > 0 && (
            <p className="text-[9px] text-muted line-through">
              Rs. {totalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full version with remove button
  return (
    <div className="flex gap-4 w-full">
      {/* Image Container */}
      <div className="relative w-20 h-20 bg-surface-2 shrink-0">
        <Image
          src={item.thumbnail || ""}
          alt={item.name}
          fill
          className="object-cover mix-blend-multiply"
        />
        {item.isComboItem && (
          <span className="absolute top-0 left-0 bg-dark text-inverse text-[8px] font-bold px-1 py-0.5 uppercase">
            Bundle
          </span>
        )}
      </div>

      {/* Details Column */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        {/* Top: Name & Price */}
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm uppercase leading-tight line-clamp-2 text-primary">
              {item.name}
            </h3>
            <div className="text-right shrink-0">
              {item.discount > 0 ? (
                <>
                  <p className="font-bold text-sm text-error">
                    Rs. {netPrice.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted line-through">
                    Rs. {totalPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="font-bold text-sm text-primary">
                  Rs. {totalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Middle: Variants & Badge */}
          <div className="mt-1">
            {item.isComboItem && item.comboName && (
              <span className="inline-block bg-dark text-inverse text-[9px] font-bold px-1.5 py-0.5 mb-1 tracking-wider uppercase">
                {item.comboName}
              </span>
            )}
            <div className="text-[10px] text-secondary font-medium uppercase space-y-0.5">
              {item.variantName && (
                <p className="text-primary">{item.variantName}</p>
              )}
              <p>
                Size:{" "}
                <span className="text-primary font-semibold">{item.size}</span>{" "}
                · Qty:{" "}
                <span className="text-primary font-semibold">
                  {item.quantity}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: Actions */}
        <div className="flex justify-start mt-2">
          <button
            onClick={() => dispatch(removeFromBag(item))}
            className="text-[10px] font-bold uppercase tracking-wider text-muted hover:text-error underline transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default BagItemCard;
