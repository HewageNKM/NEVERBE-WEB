"use client";

import React, { useState } from "react";
import { Coupon } from "@/interfaces/BagItem";
// Icons can be imported from tabler-icons-react or similar if available, using simple text/svg for now if not sure about library
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";

interface Props {
  coupon: Coupon;
}

const CouponCard: React.FC<Props> = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
    >
      {/* Left Decoration / Discount Value */}
      <div className="bg-black text-white p-6 flex flex-col items-center justify-center min-w-[120px] text-center border-r border-dashed border-gray-600 relative">
        <div className="text-3xl font-black tracking-tighter">
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}%`
            : coupon.discountType === "FIXED"
            ? `Rs.${coupon.discountValue}`
            : "FREE"}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
          {coupon.discountType === "FREE_SHIPPING" ? "Shipping" : "OFF"}
        </div>

        {/* Semi-circle cutouts simulates perforated ticket */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-2 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-600 rounded">
              {coupon.code.toUpperCase()}
            </span>
            {coupon.endDate && (
              <div className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-1">
                <span>Expires: </span>
                <CountdownTimer
                  targetDate={new Date(Number(coupon.endDate)).toISOString()}
                  labels={false}
                  className="text-red-500"
                />
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold uppercase tracking-tight mb-1">
            {coupon.name}
          </h3>
          <p className="text-sm text-gray-500 leading-snug">
            {coupon.description || "Apply this coupon at checkout to save."}
          </p>

          {/* Conditions */}
          <div className="mt-3 text-xs text-gray-400 space-y-1">
            {coupon.minOrderAmount && (
              <div>
                • Min Order: Rs. {coupon.minOrderAmount.toLocaleString()}
              </div>
            )}
            {coupon.firstOrderOnly && <div>• Verified First Order Only</div>}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`mt-4 w-full py-2.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors rounded ${
            copied
              ? "bg-green-600 text-white"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>
    </motion.div>
  );
};

export default CouponCard;
