"use client";

import React from "react";
import { ActivePromotion } from "@/components/PromotionsProvider";
import { motion } from "framer-motion";
import { IoAlertCircleOutline, IoGiftOutline } from "react-icons/io5";

interface Props {
  activePromo: ActivePromotion | null;
  currentQty: number; // Selected Qty + Bag Qty
  currentAmount: number; // (Selected Qty + Bag Qty) * Price
}

const UpsellNudge: React.FC<Props> = ({
  activePromo,
  currentQty,
  currentAmount,
}) => {
  if (!activePromo || !activePromo.conditions) return null;

  // Find the primary blocking condition (Quantity or Amount)
  // We prioritize MIN_QUANTITY/MIN_AMOUNT logic.
  // Assuming 'conditions' is an array, we find the first one that is NOT met.

  const quantityCondition = activePromo.conditions.find(
    (c) => c.type === "MIN_QUANTITY"
  );
  const amountCondition = activePromo.conditions.find(
    (c) => c.type === "MIN_AMOUNT"
  );

  let message = "";
  let progress = 100;
  let isMet = true;

  if (quantityCondition) {
    const required = Number(quantityCondition.value);
    if (currentQty < required) {
      const needed = required - currentQty;
      message = `Add ${needed} more to unlock ${activePromo.name || "offer"}!`;
      progress = (currentQty / required) * 100;
      isMet = false;
    } else {
      message = `Offer unlocked! ${activePromo.name || "Discount"} applied.`;
    }
  } else if (amountCondition) {
    const required = Number(amountCondition.value);
    if (currentAmount < required) {
      const needed = required - currentAmount;
      message = `Add Rs. ${needed.toLocaleString()} more to unlock ${
        activePromo.name || "offer"
      }!`;
      progress = (currentAmount / required) * 100;
      isMet = false;
    } else {
      message = `Offer unlocked! ${activePromo.name || "Discount"} applied.`;
    }
  } else {
    // If no explicit threshold condition, maybe it's just a direct discount (target specific product)
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg border text-sm font-medium mb-4 ${
        isMet
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-gray-50 border-gray-200 text-gray-800"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isMet ? (
          <IoGiftOutline size={18} />
        ) : (
          <IoAlertCircleOutline size={18} />
        )}
        <span>{message}</span>
      </div>

      {/* Progress Bar */}
      {!isMet && (
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default UpsellNudge;
