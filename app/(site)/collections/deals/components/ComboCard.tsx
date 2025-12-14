"use client";
import { ComboProduct } from "@/interfaces/BagItem";
import Image from "next/image";
import React from "react";
import { FiPackage } from "react-icons/fi";

const ComboCard = ({
  combo,
  onView,
}: {
  combo: ComboProduct;
  onView: (combo: ComboProduct) => void;
}) => {
  return (
    <div
      className="flex flex-col group cursor-pointer"
      onClick={() => onView(combo)}
    >
      <div className="relative aspect-3/4 bg-gray-100 mb-4 overflow-hidden">
        {combo.thumbnail ? (
          <Image
            src={combo.thumbnail.url}
            alt={combo.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <FiPackage size={48} />
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
          Bundle Deal
        </div>
        {combo.savings > 0 && (
          <div className="absolute bottom-2 right-2 bg-red-600 text-white px-2 py-1 text-[10px] uppercase font-bold tracking-wider">
            Save Rs. {combo.savings.toLocaleString()}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-bold uppercase text-sm tracking-wide group-hover:underline">
          {combo.name}
        </h3>
        <div className="flex gap-2 items-center text-sm">
          <span className="font-bold">
            Rs. {combo.comboPrice.toLocaleString()}
          </span>
          <span className="text-gray-400 line-through text-xs">
            Rs. {combo.originalPrice.toLocaleString()}
          </span>
        </div>
        <button
          className="w-full mt-2 bg-black text-white text-xs py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onView(combo);
          }}
        >
          View Bundle
        </button>
      </div>
    </div>
  );
};

export default ComboCard;
