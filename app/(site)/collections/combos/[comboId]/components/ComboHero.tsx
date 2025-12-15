"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmark } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";

import { AppDispatch } from "@/redux/store";
import { addMultipleToBag } from "@/redux/bagSlice/bagSlice";
import { ComboProduct, ComboItem } from "@/interfaces/ComboProduct";
import { BagItem } from "@/interfaces/BagItem";

interface PopulatedComboItem extends ComboItem {
  product: {
    id: string;
    name: string;
    thumbnail: { url: string };
    sellingPrice: number;
    marketPrice: number;
    discount: number;
    variants: {
      variantId: string;
      variantName: string;
      images: { url: string }[];
      sizes: string[];
    }[];
  } | null;
  variant?: {
    variantId: string;
    variantName: string;
    images: { url: string }[];
    sizes: string[];
  } | null;
}

interface PopulatedCombo extends Omit<ComboProduct, "items"> {
  items: PopulatedComboItem[];
}

// A "slot" represents one unit that needs size selection
// If an item has quantity: 2, it creates 2 slots
interface ComboSlot {
  slotId: string; // Unique identifier for this slot
  itemIndex: number; // Index in combo.items
  unitIndex: number; // Which unit (0, 1, 2...) for items with quantity > 1
  productId: string;
  product: PopulatedComboItem["product"];
  variant: PopulatedComboItem["variant"];
  required: boolean;
  isFreeUnit: boolean; // For BOGO: marks free units
  label: string; // Display label like "Shoe #1" or "Get Free"
}

interface SlotSelection {
  slotId: string;
  variantId: string;
  size: string;
  isValid: boolean;
}

interface ComboHeroProps {
  combo: PopulatedCombo;
}

const ComboHero: React.FC<ComboHeroProps> = ({ combo }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  // Expand combo items into individual slots for size selection
  const slots = useMemo<ComboSlot[]>(() => {
    const result: ComboSlot[] = [];

    combo.items.forEach((item, itemIndex) => {
      if (!item.product) return;

      const quantity = item.quantity || 1;

      for (let unitIndex = 0; unitIndex < quantity; unitIndex++) {
        const slotId = `${item.productId}-${itemIndex}-${unitIndex}`;

        // For BOGO combos, determine if this is the "free" unit
        // Typically first unit is "buy", second is "free"
        let isFreeUnit = false;
        let label = item.product.name;

        if (combo.type === "BOGO") {
          const buyQty = combo.buyQuantity || 1;
          const totalUnitsBeforeThis = result.length;

          // Calculate cumulative position across all items
          if (totalUnitsBeforeThis >= buyQty) {
            isFreeUnit = true;
            label = `${item.product.name} (FREE)`;
          } else {
            label = `${item.product.name}`;
          }
        } else if (quantity > 1) {
          // For bundles with same product multiple times
          label = `${item.product.name} #${unitIndex + 1}`;
        }

        result.push({
          slotId,
          itemIndex,
          unitIndex,
          productId: item.productId,
          product: item.product,
          variant: item.variant,
          required: item.required,
          isFreeUnit,
          label,
        });
      }
    });

    return result;
  }, [combo.items, combo.type, combo.buyQuantity]);

  const [selections, setSelections] = useState<Record<string, SlotSelection>>(
    {}
  );
  const [stockStatus, setStockStatus] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState<Record<string, boolean>>({});
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  // Initialize selections for each slot
  useEffect(() => {
    const initialSelections: Record<string, SlotSelection> = {};

    slots.forEach((slot) => {
      if (slot.product) {
        const variant = slot.variant || slot.product.variants?.[0];
        initialSelections[slot.slotId] = {
          slotId: slot.slotId,
          variantId: variant?.variantId || "",
          size: "",
          isValid: false,
        };
      }
    });

    setSelections(initialSelections);
  }, [slots]);

  // Check stock for a single size
  const checkStock = async (
    slotId: string,
    productId: string,
    variantId: string,
    size: string
  ) => {
    const key = `${slotId}-${variantId}-${size}`;

    // Skip if already loaded
    if (stockStatus[key] !== undefined) return;

    setStockLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await fetch(
        `/api/v1/inventory?productId=${productId}&variantId=${variantId}&size=${size}`
      );
      const data = await res.json();
      setStockStatus((prev) => ({ ...prev, [key]: data.quantity || 0 }));
    } catch {
      setStockStatus((prev) => ({ ...prev, [key]: 0 }));
    } finally {
      setStockLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Preload stock for all sizes of a slot's current variant
  const preloadStockForSlot = async (slot: ComboSlot, variantId: string) => {
    if (!slot.product) return;

    const variant = slot.product.variants.find(
      (v) => v.variantId === variantId
    );
    if (!variant?.sizes) return;

    // Check stock for all sizes in parallel
    await Promise.all(
      variant.sizes.map((size) =>
        checkStock(slot.slotId, slot.productId, variantId, size)
      )
    );
  };

  // Preload stock when active slot or variant changes
  useEffect(() => {
    const slot = slots[activeSlotIndex];
    const selection = selections[slot?.slotId];
    if (slot && selection?.variantId) {
      preloadStockForSlot(slot, selection.variantId);
    }
  }, [activeSlotIndex, selections, slots]);

  // Get stock status for a specific size
  const getStockForSize = (slotId: string, variantId: string, size: string) => {
    const key = `${slotId}-${variantId}-${size}`;
    return {
      quantity: stockStatus[key],
      loading: stockLoading[key],
      isOutOfStock: stockStatus[key] !== undefined && stockStatus[key] <= 0,
    };
  };

  // Handle size selection for a specific slot
  const handleSizeSelect = (slotId: string, size: string) => {
    const selection = selections[slotId];
    const slot = slots.find((s) => s.slotId === slotId);
    if (!selection || !slot) return;

    // Check if size is out of stock
    const stockInfo = getStockForSize(slotId, selection.variantId, size);
    if (stockInfo.isOutOfStock) {
      toast.error(`Size ${size} is out of stock`);
      return;
    }

    setSelections((prev) => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        size,
        isValid: true,
      },
    }));
  };

  // Handle variant selection for a specific slot
  const handleVariantSelect = (slotId: string, variantId: string) => {
    const slot = slots.find((s) => s.slotId === slotId);

    setSelections((prev) => ({
      ...prev,
      [slotId]: {
        ...prev[slotId],
        variantId,
        size: "", // Reset size when variant changes
        isValid: false,
      },
    }));

    // Preload stock for new variant
    if (slot) {
      preloadStockForSlot(slot, variantId);
    }
  };

  // Check if all required slots have valid selections
  const allSelectionsValid = slots.every((slot) => {
    if (!slot.required) return true;
    return selections[slot.slotId]?.isValid;
  });

  // Get stock for current selection of a slot
  const getStockForSlot = (slotId: string) => {
    const selection = selections[slotId];
    if (!selection?.size) return null;
    const key = `${slotId}-${selection.variantId}-${selection.size}`;
    return {
      quantity: stockStatus[key],
      loading: stockLoading[key],
    };
  };

  // Calculate pricing based on combo type
  const calculatePricing = () => {
    if (combo.type === "BOGO" && combo.buyQuantity && combo.getQuantity) {
      return {
        label: `Buy ${combo.buyQuantity}, Get ${combo.getQuantity} ${
          combo.getDiscount === 100 ? "FREE" : `at ${combo.getDiscount}% off`
        }`,
        savings: combo.savings,
      };
    }
    if (combo.type === "MULTI_BUY") {
      return {
        label: `Buy ${combo.buyQuantity || 2}+ for extra savings`,
        savings: combo.savings,
      };
    }
    return {
      label: "Bundle Price",
      savings: combo.savings,
    };
  };

  const pricing = calculatePricing();

  // Add combo to bag - each slot becomes a separate bag item with its own size
  const handleAddToBag = () => {
    if (!allSelectionsValid) {
      toast.error("Please select sizes for all items");
      return;
    }

    const bagItems: BagItem[] = [];
    const totalSlots = slots.length;

    slots.forEach((slot) => {
      if (!slot.product) return;
      const selection = selections[slot.slotId];
      if (!selection?.isValid && slot.required) return;

      const variant = slot.product.variants.find(
        (v) => v.variantId === selection.variantId
      );

      // Calculate per-slot price
      const slotOriginalPrice = slot.product.sellingPrice;
      const slotComboPrice = combo.comboPrice / totalSlots;
      const slotDiscount = slotOriginalPrice - slotComboPrice;

      bagItems.push({
        itemId: slot.productId,
        variantId: selection.variantId,
        size: selection.size,
        quantity: 1,
        price: slot.product.sellingPrice,
        name: slot.product.name,
        image: variant?.images?.[0]?.url || slot.product.thumbnail?.url || "",
        discount: Math.round(slotDiscount),
        itemType: "combo",
        maxQuantity: 10,
        comboId: combo.id,
        comboName: combo.name,
        isComboItem: true,
      });
    });

    dispatch(addMultipleToBag(bagItems));
    toast.success("Combo added to bag!");
  };

  const handleBuyNow = () => {
    handleAddToBag();
    router.push("/checkout");
  };

  const activeSlot = slots[activeSlotIndex];
  const activeProduct = activeSlot?.product;
  const activeSelection = selections[activeSlot?.slotId];
  const activeVariant = activeProduct?.variants.find(
    (v) => v.variantId === activeSelection?.variantId
  );

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 pt-4 pb-12">
      {/* LEFT COLUMN: Bundle Items Preview */}
      <div className="flex-1 lg:w-[60%] flex flex-col gap-6">
        {/* Main Image */}
        <div className="relative w-full aspect-square bg-[#f6f6f6] rounded-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                activeVariant?.images?.[0]?.url || activeProduct?.thumbnail?.url
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {activeProduct?.thumbnail?.url ||
              activeVariant?.images?.[0]?.url ? (
                <Image
                  src={
                    activeVariant?.images?.[0]?.url ||
                    activeProduct?.thumbnail?.url ||
                    ""
                  }
                  alt={activeProduct?.name || ""}
                  fill
                  priority
                  className="object-cover mix-blend-multiply"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">📦</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Combo Type Badge */}
          <div className="absolute top-4 left-4 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
            {combo.type === "BOGO"
              ? "Buy & Get Free"
              : combo.type === "MULTI_BUY"
              ? "Multi-Buy Deal"
              : "Bundle Deal"}
          </div>

          {/* Savings Badge */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 text-xs font-bold">
            Save Rs. {combo.savings.toLocaleString()}
          </div>

          {/* Free Item Badge */}
          {activeSlot?.isFreeUnit && (
            <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 text-sm font-bold uppercase">
              FREE ITEM
            </div>
          )}
        </div>

        {/* Slot Thumbnails - one for each unit */}
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot, idx) => {
            const isActive = idx === activeSlotIndex;
            const selection = selections[slot.slotId];
            const hasSize = selection?.isValid;

            return (
              <button
                key={slot.slotId}
                onClick={() => setActiveSlotIndex(idx)}
                className={`relative aspect-square bg-[#f6f6f6] rounded-lg overflow-hidden border-2 transition-all ${
                  isActive
                    ? "border-black"
                    : "border-transparent hover:border-gray-300"
                } ${
                  slot.isFreeUnit ? "ring-2 ring-green-400 ring-offset-1" : ""
                }`}
              >
                {slot.product?.thumbnail?.url ? (
                  <Image
                    src={slot.product.thumbnail.url}
                    alt={slot.product.name || ""}
                    fill
                    className="object-cover mix-blend-multiply"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    📦
                  </div>
                )}

                {/* Unit number badge for same products */}
                {combo.items.some((i) => i.quantity > 1) && (
                  <div className="absolute top-1 left-1 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                )}

                {/* Free badge for BOGO */}
                {slot.isFreeUnit && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase">
                    Free
                  </div>
                )}

                {/* Selection indicator */}
                {hasSize && (
                  <div className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-1">
                    <IoCheckmark size={12} />
                  </div>
                )}

                {/* Required badge */}
                {slot.required && !hasSize && (
                  <div className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Item Details (Desktop) */}
        <div className="hidden lg:block border-t border-gray-100 pt-6">
          <h3 className="font-bold uppercase tracking-wide text-sm mb-4">
            Bundle Includes ({slots.length} items to select)
          </h3>
          <div className="space-y-2">
            {slots.map((slot, idx) => (
              <div
                key={slot.slotId}
                onClick={() => setActiveSlotIndex(idx)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                  idx === activeSlotIndex
                    ? "bg-black text-white"
                    : slot.isFreeUnit
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="w-12 h-12 relative bg-white rounded-md overflow-hidden flex-shrink-0">
                  {slot.product?.thumbnail?.url && (
                    <Image
                      src={slot.product.thumbnail.url}
                      alt={slot.product.name || ""}
                      fill
                      className="object-cover mix-blend-multiply"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{slot.label}</p>
                  <p
                    className={`text-xs ${
                      idx === activeSlotIndex
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {selections[slot.slotId]?.isValid
                      ? `Size: ${selections[slot.slotId].size}`
                      : "Select size →"}
                  </p>
                </div>
                {slot.isFreeUnit && idx !== activeSlotIndex && (
                  <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 uppercase">
                    Free
                  </span>
                )}
                {selections[slot.slotId]?.isValid && (
                  <IoCheckmark
                    size={18}
                    className={
                      idx === activeSlotIndex
                        ? "text-green-400"
                        : "text-green-500"
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Selection & Actions */}
      <div className="lg:w-[40%] relative">
        <div className="sticky top-24 flex flex-col gap-6">
          {/* Header */}
          <div>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              {pricing.label}
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-black mt-1">
              {combo.name}
            </h1>

            {combo.description && (
              <p className="text-gray-500 text-sm mt-3">{combo.description}</p>
            )}

            {/* Pricing */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-2xl font-black">
                Rs. {combo.comboPrice.toLocaleString()}
              </span>
              <span className="text-lg text-gray-400 line-through">
                Rs. {combo.originalPrice.toLocaleString()}
              </span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                Save Rs. {pricing.savings.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Active Slot Selection */}
          {activeSlot && activeProduct && (
            <div
              className={`border rounded-lg p-4 ${
                activeSlot.isFreeUnit
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden">
                  {activeProduct.thumbnail?.url && (
                    <Image
                      src={activeProduct.thumbnail.url}
                      alt={activeProduct.name}
                      fill
                      className="object-cover mix-blend-multiply"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{activeSlot.label}</p>
                  <p className="text-xs text-gray-500">
                    Item {activeSlotIndex + 1} of {slots.length}
                    {activeSlot.isFreeUnit && (
                      <span className="ml-2 text-green-600 font-bold">
                        • FREE
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Variant Selection (if multiple) */}
              {activeProduct.variants.length > 1 && (
                <div className="mb-4">
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2 block">
                    Select Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeProduct.variants.map((variant) => (
                      <button
                        key={variant.variantId}
                        onClick={() =>
                          handleVariantSelect(
                            activeSlot.slotId,
                            variant.variantId
                          )
                        }
                        className={`w-14 h-14 bg-gray-100 rounded-md overflow-hidden border-2 transition-all ${
                          activeSelection?.variantId === variant.variantId
                            ? "border-black"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        {variant.images?.[0]?.url && (
                          <div className="relative w-full h-full">
                            <Image
                              src={variant.images[0].url}
                              alt={variant.variantName}
                              fill
                              className="object-cover mix-blend-multiply"
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {activeVariant?.sizes && activeVariant.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2 block">
                    Select Size for {activeSlot.label}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {activeVariant.sizes.map((size) => {
                      const stockInfo = getStockForSize(
                        activeSlot.slotId,
                        activeSelection?.variantId || "",
                        size
                      );
                      const isSelected = activeSelection?.size === size;
                      const isOutOfStock = stockInfo.isOutOfStock;
                      const isLoading = stockInfo.loading;

                      return (
                        <button
                          key={size}
                          onClick={() =>
                            handleSizeSelect(activeSlot.slotId, size)
                          }
                          disabled={isOutOfStock || isLoading}
                          className={`py-2.5 rounded-md text-sm font-bold border transition-all relative ${
                            isSelected
                              ? activeSlot.isFreeUnit
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-black bg-black text-white"
                              : isOutOfStock
                              ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                              : "border-gray-200 text-black hover:border-black"
                          }`}
                        >
                          {isLoading ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            size
                          )}
                          {isOutOfStock && !isSelected && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded">
                              ✕
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock Status */}
                  {activeSelection?.size && (
                    <div className="mt-2 text-xs font-bold uppercase tracking-wide">
                      {(() => {
                        const stock = getStockForSlot(activeSlot.slotId);
                        if (stock?.loading) {
                          return (
                            <span className="text-gray-400">Checking...</span>
                          );
                        }
                        if (stock?.quantity && stock.quantity > 0) {
                          return (
                            <span className="text-green-600">In Stock</span>
                          );
                        }
                        return (
                          <span className="text-red-600">Out of Stock</span>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Next Item Button */}
              {activeSlotIndex < slots.length - 1 &&
                activeSelection?.isValid && (
                  <button
                    onClick={() => setActiveSlotIndex(activeSlotIndex + 1)}
                    className="w-full mt-4 py-3 bg-gray-100 text-black font-bold text-sm uppercase tracking-wide rounded-md hover:bg-gray-200 transition-all"
                  >
                    Next: Select size for {slots[activeSlotIndex + 1]?.label} →
                  </button>
                )}
            </div>
          )}

          {/* Selection Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">
              Your Selections (
              {slots.filter((s) => selections[s.slotId]?.isValid).length}/
              {slots.length})
            </h4>
            <div className="space-y-2">
              {slots.map((slot, idx) => {
                const selection = selections[slot.slotId];
                return (
                  <div
                    key={slot.slotId}
                    onClick={() => setActiveSlotIndex(idx)}
                    className={`flex items-center justify-between text-sm py-1.5 px-2 rounded cursor-pointer transition-all ${
                      idx === activeSlotIndex
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-gray-600 truncate max-w-[50%] flex items-center gap-2">
                      {slot.isFreeUnit && (
                        <span className="bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase">
                          Free
                        </span>
                      )}
                      {slot.label}
                    </span>
                    {selection?.isValid ? (
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <IoCheckmark size={14} /> {selection.size}
                      </span>
                    ) : (
                      <span className="text-red-500 text-xs">Select size</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleAddToBag}
              disabled={!allSelectionsValid}
              className="w-full py-4 rounded-full bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              {allSelectionsValid
                ? "Add Combo to Bag"
                : `Select ${
                    slots.length -
                    slots.filter((s) => selections[s.slotId]?.isValid).length
                  } more sizes`}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!allSelectionsValid}
              className="w-full py-4 rounded-full border border-gray-300 text-black font-bold uppercase tracking-widest hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Bundle Now
            </button>

            {/* WhatsApp */}
            <div className="flex justify-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in the ${combo.name} combo deal`}
                target="_blank"
                className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 hover:text-green-600 py-2"
              >
                <FaWhatsapp size={16} /> WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComboHero;
