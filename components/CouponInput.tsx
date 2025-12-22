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

  // Confetti Effect (Nike style monochrome)
  useEffect(() => {
    if (couponState.isApplied) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#111111", "#707072", "#ffffff"],
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
        return <IoCheckmarkCircle className="text-green-600" size={16} />;
      case "error":
        return <IoCloseCircle className="text-error" size={16} />;
      case "info":
        return couponState.isValidating ? (
          <AiOutlineLoading3Quarters
            className="text-secondary animate-spin"
            size={14}
          />
        ) : (
          <IoInformationCircle className="text-blue-600" size={16} />
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
        return "text-green-700";
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
    <div className={`${className}`}>
      {/* Blocked State Message - Nike Style Utility Alert */}
      {isBlocked && hasComboItems && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 bg-surface-2 flex items-start gap-3"
        >
          <IoLockClosed className="text-primary shrink-0 mt-0.5" size={18} />
          <p className="text-[13px] font-normal text-primary leading-relaxed">
            Promotions are currently disabled. Remove combo items from your bag
            to apply a coupon.
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
            className={`w-full h-12 px-4 bg-white border rounded-[4px] text-[15px] font-normal transition-all
              placeholder:text-secondary focus:outline-none
              ${
                isBlocked
                  ? "bg-surface-2 border-transparent text-secondary cursor-not-allowed"
                  : couponState.isApplied
                  ? "bg-white border-green-600 text-green-700 font-medium"
                  : couponState.messageType === "error"
                  ? "border-error focus:border-error"
                  : "border-gray-200 focus:border-black"
              }
            `}
          />

          {couponState.code && !isBlocked && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getMessageIcon()}
            </div>
          )}
        </div>

        {/* Action Button - Nike Style Pill */}
        {couponState.isApplied ? (
          <button
            onClick={removeCouponFromCart}
            className="px-6 h-12 bg-white border border-gray-200 text-primary text-[14px] font-medium rounded-full hover:border-black transition-all"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={validateCoupon}
            disabled={
              !couponState.code || couponState.isValidating || isBlocked
            }
            className="px-8 h-12 bg-dark text-white text-[14px] font-medium rounded-full hover:opacity-70 disabled:bg-surface-2 disabled:text-secondary disabled:cursor-not-allowed transition-all"
          >
            {couponState.isValidating ? "..." : "Apply"}
          </button>
        )}
      </div>

      {/* Message Feedback */}
      <AnimatePresence mode="wait">
        {couponState.message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-2 mt-3 text-[13px] font-medium ${getMessageColor()}`}
          >
            {getMessageIcon()}
            <span>{couponState.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Condition Feedback - Technical Progress UI */}
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
                  className={`flex items-center justify-between gap-4 text-[12px] font-normal px-4 py-3 border rounded-[4px] ${
                    condition.met
                      ? "bg-white border-green-100 text-green-700"
                      : "bg-white border-gray-100 text-primary"
                  }`}
                >
                  <span className="flex-1">{condition.message}</span>
                  {!condition.met &&
                    condition.current !== undefined &&
                    condition.required !== undefined && (
                      <div className="w-24 h-[2px] bg-gray-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (condition.current / condition.required) * 100,
                              100
                            )}%`,
                          }}
                          className="h-full bg-black"
                        />
                      </div>
                    )}
                  {condition.met && (
                    <IoCheckmarkCircle size={14} className="text-green-600" />
                  )}
                </motion.div>
              ))}
            </div>
          )}
      </AnimatePresence>

      {/* Applied / Valid Details - Nike Summary Look */}
      <AnimatePresence>
        {(couponState.isApplied ||
          (couponState.couponDetails &&
            couponState.messageType === "success")) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[14px] font-medium text-primary uppercase tracking-tight">
                  {couponState.isApplied ? "Promo Applied" : "Code Eligible"}
                </p>
                <p className="text-[13px] text-secondary mt-0.5">
                  {couponState.code}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-medium text-green-700">
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
