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
          <p className="text-[14px] font-medium text-[#111] tracking-tight">
            Promotion Locked
          </p>
          <p className="text-[13px] text-[#707072] mt-0.5 font-normal">
            Promotions cannot be combined with combo deals.
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

  // --- VARIANT: INLINE (Cart/Checkout) ---
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
        <AnimatePresence>
          {displayPromotions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative p-5 border border-gray-100 bg-white"
            >
              <div className="flex items-start gap-4">
                <div className="text-[#111]">
                  {getIcon(displayPromotions[0].type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-[#111] tracking-tight">
                        {hasStackedPromotions
                          ? `${displayPromotions.length} Promotions Applied`
                          : displayPromotions[0].name}
                      </p>
                      <p className="text-[13px] text-[#707072] mt-0.5 font-normal">
                        {hasStackedPromotions
                          ? displayPromotions.map((p) => p.name).join(" + ")
                          : displayPromotions[0].message}
                      </p>
                    </div>
                    {totalPromotionDiscount > 0 && (
                      <div className="shrink-0 flex flex-col items-end">
                        <p className="text-[16px] font-medium text-[#b22222]">
                          -Rs. {totalPromotionDiscount.toLocaleString()}
                        </p>
                        {hasStackedPromotions && (
                          <p className="text-[11px] text-[#707072] uppercase font-medium">
                            Combined
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showNearby && nearestPromo && !bestPromo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-5 bg-[#f6f6f6]"
          >
            <div className="flex items-start gap-3 mb-4">
              <IoAlertCircleOutline
                className="text-[#707072] mt-0.5"
                size={20}
              />
              <div className="flex-1">
                <p className="text-[14px] font-medium text-[#111]">
                  Unlock Special Offer
                </p>
                <p className="text-[13px] text-[#707072] mt-0.5">
                  Add Rs. {nearestPromo.remaining?.toLocaleString()} to get{" "}
                  <span className="text-black font-medium">
                    {nearestPromo.name}
                  </span>
                </p>
              </div>
            </div>
            <div className="w-full h-[3px] bg-gray-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nearestPromo.progress}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="h-full bg-black"
              />
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // --- VARIANT: STICKY (Top Bar) ---
  if (variant === "sticky") {
    const promo = bestPromo || nearestPromo;
    if (!promo) return null;

    return (
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className={`w-full bg-[#111] text-white py-2.5 px-4 ${className}`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium tracking-tight">
              {promo.isEligible ? (
                <>
                  {promo.message}
                  {promo.savings && (
                    <span className="ml-3 font-bold border-b border-white">
                      Save Rs. {promo.savings.toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <>
                  Add Rs. {promo.remaining?.toLocaleString()} more for{" "}
                  <span className="font-bold underline">{promo.name}</span>
                </>
              )}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- VARIANT: CARD (Page Display) ---
  if (variant === "card") {
    return (
      <div className={`grid gap-4 ${className}`}>
        {eligiblePromotions.map((promo) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-8 group"
          >
            <div className="p-5 bg-[#f5f5f5] rounded-full text-black">
              {getIcon(promo.type)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-sm">
                  Active
                </span>
                <h3 className="text-[22px] font-medium text-[#111] tracking-tight">
                  {promo.name}
                </h3>
              </div>
              <p className="text-[15px] text-[#707072] max-w-lg mb-4">
                {promo.description}
              </p>
              {promo.savings && (
                <p className="text-[24px] font-bold text-[#111]">
                  Save Rs. {promo.savings.toLocaleString()}
                </p>
              )}
            </div>

            <Link
              href="/checkout"
              className="px-10 py-4 bg-black text-white rounded-full font-medium text-[15px] transition-transform active:scale-[0.97] hover:opacity-80"
            >
              Apply to Order
            </Link>
          </motion.div>
        ))}

        {showNearby &&
          nearbyPromotions.map((promo) => (
            <motion.div
              key={promo.id}
              className="p-8 border border-gray-100 bg-white opacity-90"
            >
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="p-5 bg-[#f5f5f5] rounded-full text-[#707072] grayscale">
                  {getIcon(promo.type)}
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-[20px] font-medium text-[#111] tracking-tight mb-4">
                    {promo.name}
                  </h3>
                  <p className="text-[14px] text-[#111] font-medium mb-4">
                    Add{" "}
                    <span className="underline underline-offset-4 font-bold">
                      Rs. {promo.remaining?.toLocaleString()}
                    </span>{" "}
                    to unlock
                  </p>
                  <div className="w-full max-w-sm h-[3px] bg-gray-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${promo.progress}%` }}
                      className="h-full bg-black"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    );
  }

  return null;
};

export default PromotionBanner;
