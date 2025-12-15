"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoGift,
  IoFlash,
  IoCheckmarkCircle,
  IoArrowForward,
  IoLockClosed,
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
    isLoading,
    hasComboItems,
    isBlocked,
  } = usePromotions();

  // Show blocked message if combo items are in the bag
  if (isBlocked && hasComboItems && variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-sm ${className}`}
      >
        <IoLockClosed className="text-amber-600 shrink-0" size={18} />
        <p className="text-xs font-medium text-amber-800">
          Promotions cannot be combined with combo deals.
        </p>
      </motion.div>
    );
  }

  if (isLoading) return null;

  // Get the best eligible promotion
  const bestPromo = eligiblePromotions[0];
  const nearestPromo = nearbyPromotions[0];

  if (!bestPromo && !nearestPromo) return null;

  const getIcon = (type: ActivePromotion["type"]) => {
    switch (type) {
      case "BOGO":
        return <IoGift size={18} />;
      case "PERCENTAGE":
      case "FIXED":
        return <IoFlash size={18} />;
      default:
        return <IoCheckmarkCircle size={18} />;
    }
  };

  // Inline variant for cart/checkout
  if (variant === "inline") {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Eligible promotion */}
        <AnimatePresence>
          {bestPromo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-sm"
            >
              <div className="text-green-600">{getIcon(bestPromo.type)}</div>
              <div className="flex-1">
                <p className="text-xs font-bold text-green-800 uppercase tracking-wide">
                  {bestPromo.name}
                </p>
                <p className="text-[11px] text-green-600">
                  {bestPromo.message}
                </p>
              </div>
              {bestPromo.savings && (
                <div className="text-right">
                  <p className="text-sm font-black text-green-700">
                    -Rs. {bestPromo.savings.toLocaleString()}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nearby promotion (spend X more to unlock) */}
        {showNearby && nearestPromo && !bestPromo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-yellow-50 border border-yellow-200 rounded-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-yellow-600">
                {getIcon(nearestPromo.type)}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-yellow-800 uppercase tracking-wide">
                  Almost There!
                </p>
                <p className="text-[11px] text-yellow-700">
                  Spend Rs. {nearestPromo.remaining?.toLocaleString()} more to
                  unlock <span className="font-bold">{nearestPromo.name}</span>
                </p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 bg-yellow-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${nearestPromo.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-yellow-500"
              />
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Sticky banner for top of page
  if (variant === "sticky") {
    const promo = bestPromo || nearestPromo;
    if (!promo) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full bg-black text-white py-2 px-4 ${className}`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {getIcon(promo.type)}
            <span className="text-xs font-bold uppercase tracking-wide">
              {promo.isEligible ? (
                <>
                  {promo.message}
                  {promo.savings && (
                    <span className="ml-2 text-green-400">
                      Save Rs. {promo.savings.toLocaleString()}!
                    </span>
                  )}
                </>
              ) : (
                <>
                  Spend Rs. {promo.remaining?.toLocaleString()} more for{" "}
                  {promo.name}
                </>
              )}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Card variant for display on pages
  if (variant === "card") {
    return (
      <div className={`grid gap-4 ${className}`}>
        {eligiblePromotions.map((promo) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                {getIcon(promo.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-green-800">
                  {promo.name}
                </h3>
                <p className="text-sm text-green-600 mt-1">
                  {promo.description}
                </p>
                {promo.savings && (
                  <p className="mt-2 text-lg font-black text-green-700">
                    You save Rs. {promo.savings.toLocaleString()}
                  </p>
                )}
              </div>
              <Link
                href="/checkout"
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white font-bold text-xs uppercase tracking-wide rounded-sm hover:bg-green-700 transition-colors"
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                  {getIcon(promo.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-yellow-800">
                    {promo.name}
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Add Rs. {promo.remaining?.toLocaleString()} to your cart to
                    unlock this offer!
                  </p>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-yellow-600 mb-1">
                      <span>Progress</span>
                      <span>{promo.progress}%</span>
                    </div>
                    <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${promo.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-yellow-500"
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
