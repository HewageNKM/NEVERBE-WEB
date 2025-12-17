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
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-start gap-3 p-4 border border-black bg-gray-50 ${className}`}
      >
        <IoLockClosedOutline className="text-black shrink-0 mt-0.5" size={16} />
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-black leading-tight">
            Promotion Locked
          </p>
          <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1 font-medium">
            Promotions cannot be combined with combo deals.
          </p>
        </div>
      </motion.div>
    );
  }

  if (isLoading) return null;

  // Get the best eligible promotion
  const bestPromo = eligiblePromotions[0];
  const nearestPromo = nearbyPromotions[0];

  if (!bestPromo && !nearestPromo && restrictedPromotions.length === 0)
    return null;

  const getIcon = (type: ActivePromotion["type"]) => {
    switch (type) {
      case "BOGO":
        return <IoGiftOutline size={18} />;
      case "PERCENTAGE":
      case "FIXED":
        return <IoFlashOutline size={18} />;
      default:
        return <IoCheckmarkCircleOutline size={18} />;
    }
  };

  // --- VARIANT: INLINE (Cart/Checkout) ---
  if (variant === "inline") {
    // Use applied promotions if available, otherwise show best eligible
    const displayPromotions =
      appliedPromotions.length > 0
        ? appliedPromotions
        : bestPromo
        ? [bestPromo]
        : [];
    const hasStackedPromotions = displayPromotions.length > 1;

    return (
      <div className={`space-y-4 ${className}`}>
        {/* Applied/Eligible promotions */}
        <AnimatePresence>
          {displayPromotions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative p-4 border border-black bg-white"
            >
              <div className="flex items-start gap-4">
                <div className="text-black">
                  {getIcon(displayPromotions[0].type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      {hasStackedPromotions ? (
                        <>
                          <p className="text-xs font-black text-black uppercase tracking-wider truncate">
                            {displayPromotions.length} Promotions Applied
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1 font-medium leading-relaxed break-words">
                            {displayPromotions.map((p) => p.name).join(" + ")}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-black text-black uppercase tracking-wider truncate">
                            {displayPromotions[0].name}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-1 font-medium break-words">
                            {displayPromotions[0].message}
                          </p>
                        </>
                      )}
                    </div>
                    {totalPromotionDiscount > 0 && (
                      <div className="shrink-0 bg-black text-white px-3 py-1.5 min-w-[100px] text-center sm:text-right self-start">
                        <p className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                          -Rs. {totalPromotionDiscount.toLocaleString()}
                        </p>
                        {hasStackedPromotions && (
                          <p className="text-[8px] text-gray-300 uppercase tracking-wide">
                            Combined Savings
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

        {/* Nearby promotion (Spend X more) */}
        {showNearby && nearestPromo && !bestPromo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-dashed border-gray-400 bg-gray-50"
          >
            <div className="flex items-center gap-3 mb-3">
              <IoAlertCircleOutline className="text-gray-500" size={18} />
              <div className="flex-1">
                <p className="text-xs font-black text-black uppercase tracking-wider">
                  Unlock Offer
                </p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 font-medium">
                  Add Rs. {nearestPromo.remaining?.toLocaleString()} to get{" "}
                  <span className="text-black font-bold">
                    {nearestPromo.name}
                  </span>
                </p>
              </div>
            </div>

            {/* Sharp Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-none">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nearestPromo.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-black"
              />
            </div>
          </motion.div>
        )}

        {/* Restricted promotions (user can see but cannot apply) */}
        {restrictedPromotions.length > 0 && !bestPromo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-dashed border-gray-300 bg-gray-50/50"
          >
            <div className="flex items-start gap-3">
              <IoLockClosedOutline
                className="text-gray-400 shrink-0 mt-0.5"
                size={16}
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Available Offers
                </p>
                <div className="mt-2 space-y-2">
                  {restrictedPromotions.slice(0, 2).map((promo) => (
                    <div key={promo.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                          {promo.name}
                        </p>
                        <p className="text-[9px] text-gray-500 mt-0.5">
                          {promo.restrictionReason ||
                            "Add eligible items to unlock"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full bg-black text-white py-3 px-4 border-b border-gray-800 ${className}`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {getIcon(promo.type)}
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
              {promo.isEligible ? (
                <>
                  {promo.message}
                  {promo.savings && (
                    <span className="ml-3 px-2 py-0.5 bg-white text-black font-black">
                      Save Rs. {promo.savings.toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <>
                  Spend Rs. {promo.remaining?.toLocaleString()} more for{" "}
                  <span className="border-b border-white pb-0.5">
                    {promo.name}
                  </span>
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
      <div className={`grid gap-6 ${className}`}>
        {eligiblePromotions.map((promo) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 border border-black bg-white relative overflow-hidden group"
          >
            {/* Hover Effect Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500 z-0" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 border border-black bg-black text-white">
                {getIcon(promo.type)}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                    Active
                  </span>
                  <h3 className="font-black text-xl text-black uppercase tracking-tighter italic">
                    {promo.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium max-w-md">
                  {promo.description}
                </p>
                {promo.savings && (
                  <p className="text-2xl font-black text-black tracking-tight mt-1">
                    Save Rs. {promo.savings.toLocaleString()}
                  </p>
                )}
              </div>

              <Link
                href="/checkout"
                className="flex items-center gap-2 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all hover:pr-10 duration-300"
              >
                Checkout <IoArrowForward size={14} />
              </Link>
            </div>
          </motion.div>
        ))}

        {showNearby &&
          nearbyPromotions.map((promo) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 border border-gray-300 bg-white opacity-80 hover:opacity-100 transition-opacity"
            >
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 border border-gray-300 text-gray-400">
                  {getIcon(promo.type)}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="border border-black text-black text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                      Locked
                    </span>
                    <h3 className="font-bold text-lg text-gray-800 uppercase tracking-tight">
                      {promo.name}
                    </h3>
                  </div>

                  <p className="text-xs text-black uppercase tracking-wide font-bold mt-2 mb-4">
                    Add{" "}
                    <span className="border-b border-black">
                      Rs. {promo.remaining?.toLocaleString()}
                    </span>{" "}
                    to unlock
                  </p>

                  {/* Technical Progress Bar */}
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">
                      <span>Progress</span>
                      <span>{promo.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 w-full rounded-none">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${promo.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-black"
                      />
                    </div>
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
