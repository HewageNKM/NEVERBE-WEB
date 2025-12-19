"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoGiftOutline,
  IoFlashOutline,
  IoCheckmarkCircleOutline,
  IoArrowForward,
  IoLockClosedOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import usePromotions, { ActivePromotion } from "@/hooks/usePromotions";

interface PromotionBannerProps {
  variant?: "inline" | "sticky" | "card";
  showNearby?: boolean;
  className?: string;
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({
  variant = "inline",
  showNearby = true,
  className = "",
}) => {
  const {
    eligiblePromotions,
    nearbyPromotions,
    restrictedPromotions,
    isLoading,
    hasComboItems,
    isBlocked,
    appliedPromotions,
    totalPromotionDiscount,
  } = usePromotions();

  // --- BLOCKED STATE (Combo Items) ---
  if (isBlocked && hasComboItems && variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-start gap-3 p-5 bg-[#f5f5f5] ${className}`}
      >
        <IoLockClosedOutline
          className="text-[#111] shrink-0 mt-0.5"
          size={18}
        />
        <div>
          <p className="text-[14px] font-medium text-[#111] tracking-tight leading-none">
            Promotions Locked
          </p>
          <p className="text-[13px] text-[#707072] mt-1.5 font-normal leading-relaxed">
            Special offers cannot be combined with combo deals. Remove items to
            unlock.
          </p>
        </div>
      </motion.div>
    );
  }

  if (isLoading) return null;

  const bestPromo = eligiblePromotions[0];
  const nearestPromo = nearbyPromotions[0];

  if (!bestPromo && !nearestPromo && restrictedPromotions.length === 0)
    return null;

  const getIcon = (type: ActivePromotion["type"]) => {
    switch (type) {
      case "BOGO":
        return <IoGiftOutline size={20} />;
      case "PERCENTAGE":
      case "FIXED":
        return <IoFlashOutline size={20} />;
      default:
        return <IoCheckmarkCircleOutline size={20} />;
    }
  };

  // --- VARIANT: INLINE (Cart/Checkout Summary Look) ---
  if (variant === "inline") {
    const displayPromotions =
      appliedPromotions.length > 0
        ? appliedPromotions
        : bestPromo
        ? [bestPromo]
        : [];
    const hasStackedPromotions = displayPromotions.length > 1;

    return (
      <div className={`space-y-6 ${className}`}>
        <AnimatePresence mode="wait">
          {displayPromotions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 border border-gray-100 bg-white"
            >
              <div className="flex items-start gap-4">
                <div className="text-[#111] pt-0.5">
                  {getIcon(displayPromotions[0].type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium text-[#111] tracking-tight">
                        {hasStackedPromotions
                          ? `${displayPromotions.length} Offers Applied`
                          : displayPromotions[0].name}
                      </p>
                      <p className="text-[13px] text-[#707072] mt-0.5">
                        {hasStackedPromotions
                          ? displayPromotions.map((p) => p.name).join(" + ")
                          : displayPromotions[0].message}
                      </p>
                    </div>
                    {totalPromotionDiscount > 0 && (
                      <p className="text-[16px] font-medium text-[#b22222] whitespace-nowrap">
                        -Rs. {totalPromotionDiscount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technical Progress UI for Nearby Promos */}
        {showNearby && nearestPromo && !bestPromo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 bg-[#f6f6f6]"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <IoAlertCircleOutline
                  className="text-[#111] mt-0.5"
                  size={20}
                />
                <div>
                  <p className="text-[14px] font-medium text-[#111]">
                    Unlock Special Savings
                  </p>
                  <p className="text-[13px] text-[#707072] mt-0.5 leading-relaxed">
                    Spend{" "}
                    <span className="text-black font-bold tracking-tight">
                      Rs. {nearestPromo.remaining?.toLocaleString()}
                    </span>{" "}
                    more to get {nearestPromo.name}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#111]">
                {nearestPromo.progress}%
              </span>
            </div>
            <div className="w-full h-[2px] bg-gray-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nearestPromo.progress}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-[#111]"
              />
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // --- VARIANT: STICKY (Nike Pro Top Utility) ---
  if (variant === "sticky") {
    const promo = bestPromo || nearestPromo;
    if (!promo) return null;

    return (
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="w-full bg-[#111] text-white py-2.5 px-4"
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-center">
          <p className="text-[12px] md:text-[13px] font-medium tracking-tight flex items-center gap-2">
            {promo.isEligible ? (
              <>
                <span>{promo.message}</span>
                {promo.savings && (
                  <span className="bg-white text-black px-2 py-0.5 font-bold">
                    SAVE RS. {promo.savings.toLocaleString()}
                  </span>
                )}
              </>
            ) : (
              <span>
                Add Rs. {promo.remaining?.toLocaleString()} for{" "}
                <span className="underline underline-offset-4">
                  {promo.name}
                </span>
              </span>
            )}
          </p>
        </div>
      </motion.div>
    );
  }

  // --- VARIANT: CARD (Gallery Display) ---
  if (variant === "card") {
    return (
      <div className="grid gap-6">
        {eligiblePromotions.map((promo) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 border border-gray-100 bg-white flex flex-col md:flex-row items-center gap-8 group"
          >
            <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center text-[#111] shrink-0">
              {getIcon(promo.type)}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-[#111] text-white px-2 py-1">
                  Active
                </span>
                <h3 className="text-[22px] font-medium text-[#111] tracking-tight">
                  {promo.name}
                </h3>
              </div>
              <p className="text-[15px] text-[#707072] mt-2 mb-4 leading-relaxed">
                {promo.description}
              </p>
              {promo.savings && (
                <p className="text-[20px] font-bold text-[#b22222]">
                  Save Rs. {promo.savings.toLocaleString()}
                </p>
              )}
            </div>

            <Link
              href="/checkout"
              className="px-10 py-4 bg-[#111] text-white rounded-full font-medium text-[15px] transition-all hover:opacity-70 active:scale-[0.98]"
            >
              Apply to Order
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

export default PromotionBanner;
