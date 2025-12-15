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
        <div className="relative w-14 h-14 bg-[#f6f6f6] shrink-0 border border-gray-100">
          <Image
            src={item.image || ""}
            alt={item.name}
            fill
            className="object-cover mix-blend-multiply"
          />
          {item.isComboItem && (
            <span className="absolute -top-1 -left-1 bg-black text-white text-[7px] font-bold px-1">
              Bundle
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase truncate">{item.name}</p>
          <p className="text-[10px] text-gray-500 uppercase">
            Size: {item.size} · Qty: {item.quantity}
          </p>
          {item.isComboItem && item.comboName && (
            <p className="text-[9px] text-gray-400 uppercase mt-0.5">
              {item.comboName}
            </p>
          )}
          {showRemove && (
            <button
              onClick={() => dispatch(removeFromBag(item))}
              className="text-[9px] font-bold uppercase tracking-wide text-gray-400 hover:text-red-600 underline transition-colors mt-1"
            >
              Remove
            </button>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-bold font-mono">
            Rs. {netPrice.toLocaleString()}
          </p>
          {item.discount > 0 && (
            <p className="text-[9px] text-gray-400 line-through">
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
      <div className="relative w-20 h-20 bg-[#f6f6f6] shrink-0">
        <Image
          src={item.image || ""}
          alt={item.name}
          fill
          className="object-cover mix-blend-multiply"
        />
        {item.isComboItem && (
          <span className="absolute top-0 left-0 bg-black text-white text-[8px] font-bold px-1 py-0.5 uppercase">
            Bundle
          </span>
        )}
      </div>

      {/* Details Column */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        {/* Top: Name & Price */}
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm uppercase leading-tight line-clamp-2 text-black">
              {item.name}
            </h3>
            <div className="text-right shrink-0">
              {item.discount > 0 ? (
                <>
                  <p className="font-bold text-sm text-black">
                    Rs. {netPrice.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 line-through">
                    Rs. {totalPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="font-bold text-sm">
                  Rs. {totalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Middle: Variants & Badge */}
          <div className="mt-1">
            {item.isComboItem && item.comboName && (
              <span className="inline-block bg-black text-white text-[9px] font-bold px-1.5 py-0.5 mb-1 tracking-wider uppercase">
                {item.comboName}
              </span>
            )}
            <div className="text-[10px] text-gray-500 font-medium uppercase space-y-0.5">
              {item.variantName && (
                <p className="text-gray-800">{item.variantName}</p>
              )}
              <p>
                Size:{" "}
                <span className="text-black font-semibold">{item.size}</span> ·
                Qty:{" "}
                <span className="text-black font-semibold">
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
            className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 underline transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default BagItemCard;
