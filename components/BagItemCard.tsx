"use client";
import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeFromBag } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces";

const BagItemCard = ({ item }: { item: BagItem }) => {
  const dispatch: AppDispatch = useDispatch();
  const totalPrice = item.price * item.quantity;

  return (
    <div className="flex gap-4 w-full">
      {/* Image Container - Nike Style Gray Box */}
      <div className="relative w-24 h-24 bg-[#f6f6f6] rounded-md shrink-0 overflow-hidden">
        <Image
          src={item.thumbnail}
          alt={item.name}
          width={150}
          height={150}
          className="w-full h-full object-cover mix-blend-multiply" // Blends white background images nicely
        />
      </div>

      {/* Details Column */}
      <div className="flex flex-1 flex-col justify-between py-1">
        {/* Top: Name & Price */}
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm uppercase leading-tight line-clamp-2 text-black">
              {item.name}
            </h3>
            <p className="font-bold text-sm shrink-0">
              Rs. {totalPrice.toLocaleString()}
            </p>
          </div>

          {/* Middle: Variants */}
          <div className="mt-1 text-xs text-gray-500 font-medium space-y-0.5">
            <p className="capitalize text-gray-800">{item.variantName}</p>
            <p>
              Size: <span className="text-black">{item.size}</span>
            </p>
            <p>
              Qty: <span className="text-black">{item.quantity}</span>
            </p>
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
