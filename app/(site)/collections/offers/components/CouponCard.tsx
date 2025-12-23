"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import { Coupon } from "@/interfaces/Coupon";

interface Props {
  coupon: Coupon;
}

/**
 * CouponCard - NEVERBE Performance Style
 * Promotional coupon cards with branded styling and copy interaction.
 */
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
      className="relative flex flex-col md:flex-row bg-surface border border-default hover:border-accent transition-all group shadow-custom hover:shadow-hover"
    >
      {/* Visual Header / Discount */}
      <div className="bg-surface-2 p-8 flex flex-col items-start justify-center md:min-w-[180px]">
        <div className="text-4xl font-display font-black tracking-tighter text-primary italic leading-none">
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}%`
            : coupon.discountType === "FIXED"
            ? `Rs.${coupon.discountValue.toLocaleString()}`
            : "FREE"}
        </div>
        <div className="text-base font-bold text-muted uppercase tracking-widest mt-2">
          {coupon.discountType === "FREE_SHIPPING" ? "Shipping" : "OFF"}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-8 flex flex-col justify-between">
        <div>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-accent text-dark text-[11px] font-display font-black italic px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-custom">
                {coupon.code.toUpperCase()}
              </span>
            </div>
            {coupon.endDate && (
              <div className="text-xs text-error font-black flex items-center gap-2 uppercase tracking-widest">
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
                />
              </div>
            )}
          </div>

          <h3 className="text-xl font-display font-black text-primary mb-3 uppercase italic tracking-tighter">
            {coupon.description || "Exclusive Member Offer"}
          </h3>

          <div className="space-y-1">
            {!!coupon.minOrderAmount && coupon.minOrderAmount > 0 && (
              <p className="text-sm text-muted font-bold uppercase tracking-wider">
                Min. Order: Rs. {coupon.minOrderAmount.toLocaleString()}
              </p>
            )}
            {coupon.firstOrderOnly && (
              <p className="text-sm text-muted font-bold uppercase tracking-wider">
                Verified First Order Only
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          className={`mt-6 w-full md:w-fit px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${
            copied
              ? "bg-success text-dark shadow-custom"
              : "bg-dark text-inverse hover:bg-accent hover:text-dark shadow-custom hover:shadow-hover"
          }`}
        >
          {copied ? "Protocol Copied ✓" : "Copy Code"}
        </button>
      </div>
    </motion.div>
  );
};

export default CouponCard;
