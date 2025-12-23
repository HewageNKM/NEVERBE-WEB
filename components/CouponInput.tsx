"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoLockClosed,
} from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useCoupon from "@/hooks/useCoupon";
import confetti from "canvas-confetti";

interface CouponInputProps {
  className?: string;
  onDiscountChange?: (discount: number) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({
  className = "",
  onDiscountChange,
}) => {
  const {
    couponState,
    setCode,
    validateCoupon,
    removeCouponFromCart,
    isBlocked,
    hasComboItems,
  } = useCoupon({ autoValidate: false, debounceMs: 600 });

  // Confetti Effect (Updated with NEVERBE Brand Green)
  useEffect(() => {
    if (couponState.isApplied) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#97e13e", "#1a1a1a", "#ffffff"], // Green, Dark, White
      });
    }
  }, [couponState.isApplied]);

  useEffect(() => {
    if (onDiscountChange) {
      onDiscountChange(couponState.discount);
    }
  }, [couponState.discount, onDiscountChange]);

  const getMessageIcon = () => {
    switch (couponState.messageType) {
      case "success":
        return <IoCheckmarkCircle className="text-success" size={16} />;
      case "error":
        return <IoCloseCircle className="text-error" size={16} />;
      case "info":
        return couponState.isValidating ? (
          <AiOutlineLoading3Quarters
            className="text-accent animate-spin"
            size={14}
          />
        ) : (
          <IoInformationCircle className="text-info" size={16} />
        );
      case "restricted":
        return <IoLockClosed className="text-warning" size={16} />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (couponState.messageType) {
      case "success":
        return "text-success";
      case "error":
        return "text-error";
      case "info":
        return "text-secondary";
      case "restricted":
        return "text-warning";
      default:
        return "text-secondary";
    }
  };

  return (
    <div className={`${className} animate-fade`}>
      {/* Blocked State - Brand Surface Alert */}
      {isBlocked && hasComboItems && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-surface-2 border-l-4 border-accent flex items-start gap-3 shadow-custom"
        >
          <IoLockClosed className="text-primary shrink-0 mt-0.5" size={18} />
          <p className="text-base font-medium text-primary leading-relaxed">
            Promotions are currently locked. Remove bundle items to use a
            coupon.
          </p>
        </motion.div>
      )}

      {/* Input Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={couponState.code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={isBlocked ? "Promotions locked" : "Promo Code"}
            disabled={couponState.isApplied || isBlocked}
            className={`w-full h-12 px-4 bg-surface border rounded-[4px] text-md font-medium transition-all
              placeholder:text-muted focus:outline-none
              ${
                isBlocked
                  ? "bg-surface-3 border-transparent text-muted cursor-not-allowed"
                  : couponState.isApplied
                  ? "bg-surface-2 border-success text-success"
                  : couponState.messageType === "error"
                  ? "border-error focus:border-error"
                  : "border-border-secondary focus:border-accent"
              }
            `}
          />

          {couponState.code && !isBlocked && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getMessageIcon()}
            </div>
          )}
        </div>

        {/* Action Button */}
        {couponState.isApplied ? (
          <button
            onClick={removeCouponFromCart}
            className="px-6 h-12 bg-surface border border-border-secondary text-primary text-base font-bold rounded-full hover:border-dark transition-all"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={validateCoupon}
            disabled={
              !couponState.code || couponState.isValidating || isBlocked
            }
            className="px-8 h-12 bg-dark text-inverse text-base font-bold rounded-full hover:bg-accent hover:text-primary disabled:bg-surface-3 disabled:text-muted disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            {couponState.isValidating ? "..." : "Apply"}
          </button>
        )}
      </div>

      {/* Message Feedback */}
      <AnimatePresence mode="wait">
        {couponState.message && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 mt-3 text-base font-bold italic tracking-tight ${getMessageColor()}`}
          >
            {getMessageIcon()}
            <span>{couponState.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Condition Feedback - Technical Progress UI */}
      <AnimatePresence>
        {couponState.conditionFeedback &&
          couponState.conditionFeedback.length > 0 && (
            <div className="mt-4 space-y-2">
              {couponState.conditionFeedback.map((condition, index) => (
                <motion.div
                  key={condition.type}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between gap-4 text-xs font-bold px-4 py-3 border rounded-[4px] shadow-sm ${
                    condition.met
                      ? "bg-surface-2 border-success/30 text-success"
                      : "bg-surface border-border-primary text-primary"
                  }`}
                >
                  <span className="flex-1 uppercase tracking-wider">
                    {condition.message}
                  </span>
                  {!condition.met &&
                    condition.current !== undefined &&
                    condition.required !== undefined && (
                      <div className="w-24 h-[3px] bg-surface-3 overflow-hidden rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (condition.current / condition.required) * 100,
                              100
                            )}%`,
                          }}
                          className="h-full bg-accent shadow-[0_0_8px_rgba(151,225,62,0.5)]"
                        />
                      </div>
                    )}
                  {condition.met && <IoCheckmarkCircle size={16} />}
                </motion.div>
              ))}
            </div>
          )}
      </AnimatePresence>

      {/* Applied Summary - Premium Nike-Style Finish */}
      <AnimatePresence>
        {(couponState.isApplied ||
          (couponState.couponDetails &&
            couponState.messageType === "success")) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-border-primary"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-base font-black text-primary uppercase italic tracking-tighter">
                  {couponState.isApplied ? "Promo Applied" : "Code Eligible"}
                </p>
                <p className="text-xs text-muted font-mono mt-0.5">
                  ID: {couponState.code?.toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-success tracking-tighter italic">
                  -Rs. {couponState.discount.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponInput;
