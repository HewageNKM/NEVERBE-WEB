"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import { Coupon } from "@/interfaces/Coupon";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex flex-col md:flex-row bg-surface border border-default hover:border-strong transition-all group"
    >
      {/* Visual Header / Discount */}
      <div className="bg-surface-2 p-8 flex flex-col items-start justify-center md:min-w-[160px]">
        <div className="text-[32px] font-medium tracking-tight text-primary leading-none">
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}%`
            : coupon.discountType === "FIXED"
            ? `Rs.${coupon.discountValue.toLocaleString()}`
            : "FREE"}
        </div>
        <div className="text-[14px] font-medium text-secondary mt-1">
          {coupon.discountType === "FREE_SHIPPING" ? "Shipping" : "OFF"}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-dark text-inverse text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {coupon.code.toUpperCase()}
              </span>
            </div>
            {coupon.endDate && (
              <div className="text-[12px] text-error font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
                <span>Ends In: </span>
                <CountdownTimer
                  targetDate={
                    typeof coupon.endDate === "string"
                      ? coupon.endDate
                      : (coupon.endDate as any)?.toDate
                      ? (coupon.endDate as any).toDate().toISOString()
                      : new Date(coupon.endDate as any).toISOString()
                  }
                  labels={false}
                  compact={true}
                  className="font-bold"
                />
              </div>
            )}
          </div>

          <h3 className="text-[18px] font-medium text-primary mb-2 tracking-tight">
            {coupon.description || "Exclusive Member Offer"}
          </h3>

          <div className="space-y-1">
            {!!coupon.minOrderAmount && coupon.minOrderAmount > 0 && (
              <p className="text-[13px] text-secondary">
                Min. Order: Rs. {coupon.minOrderAmount.toLocaleString()}
              </p>
            )}
            {coupon.firstOrderOnly && (
              <p className="text-[13px] text-secondary">
                Verified First Order Only
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`mt-6 w-full md:w-fit px-10 py-3 rounded-full text-[14px] font-medium transition-all active:scale-[0.98] ${
            copied
              ? "bg-dark text-inverse opacity-80"
              : "bg-dark text-inverse hover:opacity-70"
          }`}
        >
          {copied ? "Code Copied" : "Copy Code"}
        </button>
      </div>
    </motion.div>
  );
};

export default CouponCard;
