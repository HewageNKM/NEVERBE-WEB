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
  } = useCoupon({ autoValidate: true, debounceMs: 600 });

  // Notify parent of discount changes
  useEffect(() => {
    if (onDiscountChange) {
      onDiscountChange(couponState.discount);
    }
  }, [couponState.discount, onDiscountChange]);

  const getMessageIcon = () => {
    switch (couponState.messageType) {
      case "success":
        return <IoCheckmarkCircle className="text-green-500" size={16} />;
      case "error":
        return <IoCloseCircle className="text-red-500" size={16} />;
      case "info":
        return couponState.isValidating ? (
          <AiOutlineLoading3Quarters
            className="text-gray-400 animate-spin"
            size={14}
          />
        ) : (
          <IoInformationCircle className="text-blue-500" size={16} />
        );
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (couponState.messageType) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-500";
      case "info":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className={`${className}`}>
      {/* Blocked State Message */}
      {isBlocked && hasComboItems && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-sm flex items-center gap-2"
        >
          <IoLockClosed className="text-amber-600 shrink-0" size={18} />
          <p className="text-xs font-medium text-amber-800">
            Coupons cannot be combined with combo deals. Remove combo items to
            use a coupon.
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
            placeholder={isBlocked ? "Coupons disabled" : "Enter coupon code"}
            disabled={couponState.isApplied || isBlocked}
            className={`w-full h-11 px-4 bg-white border rounded-sm text-sm uppercase font-medium
              placeholder:normal-case placeholder:text-gray-400
              focus:outline-none focus:ring-1 transition-all
              ${
                isBlocked
                  ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  : couponState.isApplied
                  ? "bg-green-50 border-green-300 text-green-700"
                  : couponState.messageType === "error"
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-black focus:border-black"
              }
              disabled:cursor-not-allowed
            `}
          />

          {/* Status Icon inside input */}
          {couponState.code && !isBlocked && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getMessageIcon()}
            </div>
          )}
          {isBlocked && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <IoLockClosed className="text-gray-400" size={16} />
            </div>
          )}
        </div>

        {/* Action Button */}
        {couponState.isApplied ? (
          <button
            onClick={removeCouponFromCart}
            className="px-4 h-11 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wide 
              hover:bg-gray-200 transition-colors rounded-sm min-w-[80px]"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={validateCoupon}
            disabled={
              !couponState.code || couponState.isValidating || isBlocked
            }
            className={`px-4 h-11 text-xs font-bold uppercase tracking-wide 
              transition-all rounded-sm min-w-[80px]
              bg-black text-white hover:bg-gray-800
              disabled:bg-gray-300 disabled:cursor-not-allowed
            `}
          >
            {couponState.isValidating ? "..." : "Apply"}
          </button>
        )}
      </div>

      {/* Message Feedback */}
      <AnimatePresence mode="wait">
        {couponState.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${getMessageColor()}`}
            >
              {getMessageIcon()}
              <span>{couponState.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Condition Feedback */}
      <AnimatePresence>
        {couponState.conditionFeedback &&
          couponState.conditionFeedback.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {couponState.conditionFeedback.map((condition, index) => (
                <motion.div
                  key={condition.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-2 text-[11px] font-medium px-3 py-2 rounded-sm ${
                    condition.met
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  <span>{condition.message}</span>
                  {/* Progress bar for min amount/quantity */}
                  {!condition.met &&
                    condition.current !== undefined &&
                    condition.required !== undefined && (
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (condition.current / condition.required) * 100,
                              100
                            )}%`,
                          }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                    )}
                </motion.div>
              ))}
            </motion.div>
          )}
      </AnimatePresence>

      {/* Coupon Details (when valid) */}
      <AnimatePresence>
        {couponState.couponDetails &&
          couponState.messageType === "success" &&
          !couponState.isApplied && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-green-50 border border-green-200 rounded-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-green-800 uppercase">
                    {couponState.couponDetails.name ||
                      couponState.couponDetails.code}
                  </p>
                  {couponState.couponDetails.description && (
                    <p className="text-[11px] text-green-600 mt-0.5">
                      {couponState.couponDetails.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-green-700">
                    -Rs. {couponState.discount.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Applied Badge */}
      {couponState.isApplied && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-3 bg-green-50 border border-green-300 rounded-sm"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <IoCheckmarkCircle className="text-green-600" size={20} />
              <div>
                <p className="text-xs font-bold text-green-800 uppercase tracking-wide">
                  Coupon Applied
                </p>
                <p className="text-[10px] text-green-600">{couponState.code}</p>
              </div>
            </div>
            <p className="text-xl font-black text-green-700">
              -Rs. {couponState.discount.toLocaleString()}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CouponInput;
