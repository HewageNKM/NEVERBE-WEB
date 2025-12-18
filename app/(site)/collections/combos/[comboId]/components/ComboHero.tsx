"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmark, IoChevronForward } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/redux/store";
import { addMultipleToBag } from "@/redux/bagSlice/bagSlice";
import { ComboProduct, ComboItem } from "@/interfaces/ComboProduct";
import { BagItem, VariantMode } from "@/interfaces/BagItem";

// --- Types ---
interface PopulatedComboItem extends ComboItem {
  product: {
    id: string;
    name: string;
    thumbnail: { url: string };
    sellingPrice: number;
    marketPrice: number;
    buyingPrice: number;
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

interface ComboSlot {
  slotId: string;
  itemIndex: number;
  unitIndex: number;
  productId: string;
  product: PopulatedComboItem["product"];
  variant: PopulatedComboItem["variant"];
  required: boolean;
  isFreeUnit: boolean;
  label: string;
  // Variant restrictions from combo item
  variantMode: VariantMode;
  variantIds?: string[];
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
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  // Helper to get bag quantity
  const getBagQty = (productId: string, variantId: string, size: string) => {
    return (
      bagItems.find(
        (b) =>
          b.itemId === productId && b.variantId === variantId && b.size === size
      )?.quantity || 0
    );
  };

  // --- Logic: Expand Items to Slots ---
  const slots = useMemo<ComboSlot[]>(() => {
    const result: ComboSlot[] = [];

    combo.items.forEach((item, itemIndex) => {
      if (!item.product) return;
      const quantity = item.quantity || 1;

      for (let unitIndex = 0; unitIndex < quantity; unitIndex++) {
        const slotId = `${item.productId}-${itemIndex}-${unitIndex}`;
        let isFreeUnit = false;
        let label = item.product.name;

        if (combo.type === "BOGO") {
          const buyQty = combo.buyQuantity || 1;
          const totalUnitsBeforeThis = result.length;
          if (totalUnitsBeforeThis >= buyQty) {
            isFreeUnit = true;
            label = `${item.product.name} (FREE)`;
          }
        } else if (quantity > 1) {
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
          variantMode: item.variantMode || "ALL_VARIANTS",
          variantIds: item.variantIds,
        });
      }
    });
    return result;
  }, [combo.items, combo.type, combo.buyQuantity]);

  // --- State ---
  const [selections, setSelections] = useState<Record<string, SlotSelection>>(
    {}
  );
  const [stockStatus, setStockStatus] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState<Record<string, boolean>>({});
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);

  // --- Logic: Initialize ---
  useEffect(() => {
    const initialSelections: Record<string, SlotSelection> = {};
    slots.forEach((slot) => {
      if (slot.product) {
        // Get allowed variants based on variantMode
        const allowedVariants =
          slot.variantMode === "SPECIFIC_VARIANTS" && slot.variantIds?.length
            ? slot.product.variants.filter((v) =>
                slot.variantIds!.includes(v.variantId)
              )
            : slot.product.variants;

        const variant = slot.variant || allowedVariants?.[0];
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

  // --- Logic: Stock Checking ---
  const checkStock = async (
    slotId: string,
    productId: string,
    variantId: string,
    size: string
  ) => {
    const key = `${slotId}-${variantId}-${size}`;
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

  const preloadStockForSlot = async (slot: ComboSlot, variantId: string) => {
    if (!slot.product) return;
    const variant = slot.product.variants.find(
      (v) => v.variantId === variantId
    );
    if (!variant?.sizes) return;
    await Promise.all(
      variant.sizes.map((size) =>
        checkStock(slot.slotId, slot.productId, variantId, size)
      )
    );
  };

  useEffect(() => {
    const slot = slots[activeSlotIndex];
    const selection = selections[slot?.slotId];
    if (slot && selection?.variantId) {
      preloadStockForSlot(slot, selection.variantId);
    }
  }, [activeSlotIndex, selections, slots]);

  const getStockForSize = (slotId: string, variantId: string, size: string) => {
    const key = `${slotId}-${variantId}-${size}`;
    const quantity = stockStatus[key];
    const loading = stockLoading[key];
    const isOutOfStock = quantity !== undefined && quantity <= 0;

    return {
      quantity,
      loading,
      isOutOfStock,
    };
  };

  const getStockForSlot = (slotId: string) => {
    const selection = selections[slotId];
    if (!selection?.size) return null;
    const key = `${slotId}-${selection.variantId}-${selection.size}`;
    return {
      quantity: stockStatus[key],
      loading: stockLoading[key],
    };
  };

  // --- Handlers ---
  const handleSizeSelect = (slotId: string, size: string) => {
    const selection = selections[slotId];
    const slot = slots.find((s) => s.slotId === slotId);
    if (!selection || !slot) return;

    const stockInfo = getStockForSize(slotId, selection.variantId, size);
    if (stockInfo.isOutOfStock) {
      toast.error(`Size ${size} is out of stock`);
      return;
    }

    const bagQty = getBagQty(slot.productId, selection.variantId, size);
    if (stockInfo.quantity !== undefined && bagQty + 1 > stockInfo.quantity) {
      toast.error(
        `Limit reached! You have ${bagQty} in bag and only ${stockInfo.quantity} available.`
      );
    }

    setSelections((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], size, isValid: true },
    }));
  };

  const handleVariantSelect = (slotId: string, variantId: string) => {
    const slot = slots.find((s) => s.slotId === slotId);
    setSelections((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], variantId, size: "", isValid: false },
    }));
    if (slot) preloadStockForSlot(slot, variantId);
  };

  const allSelectionsValid = slots.every((slot) => {
    if (!slot.required) return true;
    return selections[slot.slotId]?.isValid;
  });

  const handleAddToBag = () => {
    if (!allSelectionsValid) {
      toast.error("Please select sizes for all items");
      return;
    }

    // Validate Stock Limits again strictly
    for (const slot of slots) {
      if (!slot.product) continue;
      const selection = selections[slot.slotId];
      if (!selection?.isValid && slot.required) {
        toast.error(`Please select a size for ${slot.label}`);
        return;
      }
      if (!selection?.isValid) continue; // Skip optional if not selected

      const stockKey = `${slot.slotId}-${selection.variantId}-${selection.size}`;
      const stockQty = stockStatus[stockKey];
      const bagQty = getBagQty(
        slot.productId,
        selection.variantId,
        selection.size
      );

      if (stockQty !== undefined && bagQty + 1 > stockQty) {
        toast.error(
          `Cannot add bundle: Item "${slot.product.name}" (${selection.size}) limit reached. Stock: ${stockQty}, In Bag: ${bagQty}`
        );
        return;
      }
    }

    const bagItemsToAdd: BagItem[] = [];
    const totalSlots = slots.length;

    slots.forEach((slot) => {
      if (!slot.product) return;
      const selection = selections[slot.slotId];
      if (!selection?.isValid && slot.required) return;
      if (!selection.isValid) return; // Fix for optional skipping

      const variant = slot.product.variants.find(
        (v) => v.variantId === selection.variantId
      );

      const slotOriginalPrice = slot.product.sellingPrice;
      const slotComboPrice = combo.comboPrice / totalSlots;
      const slotDiscount = slotOriginalPrice - slotComboPrice;

      bagItemsToAdd.push({
        itemId: slot.productId,
        variantId: selection.variantId,
        size: selection.size,
        quantity: 1,
        price: slot.product.sellingPrice,
        bPrice: 0, // Set server-side in OrderService
        name: slot.product.name,
        thumbnail:
          variant?.images?.[0]?.url || slot.product.thumbnail?.url || "",
        discount: Math.round(slotDiscount),
        itemType: "combo",
        maxQuantity: 10,
        comboId: combo.id,
        comboName: combo.name,
        isComboItem: true,
      });
    });

    dispatch(addMultipleToBag(bagItemsToAdd));
    toast.success("Combo added to bag!");
  };

  const handleBuyNow = () => {
    handleAddToBag();
    router.push("/checkout");
  };

  const calculatePricing = () => {
    if (combo.type === "BOGO" && combo.buyQuantity && combo.getQuantity) {
      return {
        label: `Buy ${combo.buyQuantity}, Get ${combo.getQuantity} ${
          combo.getDiscount === 100 ? "FREE" : `at ${combo.getDiscount}% off`
        }`,
        savings: combo.savings,
      };
    }
    return {
      label: "Bundle Price",
      savings: combo.savings,
    };
  };

  const pricing = calculatePricing();
  const activeSlot = slots[activeSlotIndex];
  const activeProduct = activeSlot?.product;
  const activeSelection = selections[activeSlot?.slotId];
  const activeVariant = activeProduct?.variants.find(
    (v) => v.variantId === activeSelection?.variantId
  );

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 pb-12">
      {/* --- LEFT: VISUALS --- */}
      <div className="flex-1 lg:w-[60%] flex flex-col gap-6">
        {/* Main Image Container */}
        <div className="relative w-full aspect-square bg-[#f6f6f6] border border-transparent hover:border-gray-200 transition-colors">
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
                  alt={activeProduct?.name || "Bundle Item"}
                  fill
                  priority
                  className="object-cover mix-blend-multiply"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl grayscale opacity-20">📦</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Industrial Tags */}
          <div className="absolute top-0 left-0 flex flex-col">
            <span className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
              {combo.type === "BOGO" ? "Buy 1 Get 1" : "Bundle Deal"}
            </span>
          </div>

          <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
            Save Rs. {combo.savings.toLocaleString()}
          </div>

          {activeSlot?.isFreeUnit && (
            <div className="absolute bottom-0 left-0 bg-green-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Free Item Included
            </div>
          )}
        </div>

        {/* Slot Thumbnails Grid */}
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot, idx) => {
            const isActive = idx === activeSlotIndex;
            const selection = selections[slot.slotId];
            const hasSize = selection?.isValid;

            return (
              <button
                key={slot.slotId}
                onClick={() => setActiveSlotIndex(idx)}
                className={`
                  relative aspect-square bg-[#f6f6f6] border-2 transition-all
                  ${
                    isActive
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }
                  ${
                    slot.isFreeUnit ? "ring-2 ring-green-500 ring-offset-2" : ""
                  }
                `}
              >
                {slot.product?.thumbnail?.url && (
                  <Image
                    src={slot.product.thumbnail.url}
                    alt=""
                    fill
                    className="object-cover mix-blend-multiply"
                  />
                )}

                {/* Number Badge */}
                {combo.items.length > 1 && (
                  <div className="absolute top-0 left-0 bg-black text-white text-[9px] font-bold px-1.5 py-0.5">
                    #{idx + 1}
                  </div>
                )}

                {/* Free Badge */}
                {slot.isFreeUnit && (
                  <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-[8px] font-bold uppercase text-center py-0.5">
                    Free
                  </div>
                )}

                {/* Selected Indicator */}
                {hasSize && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white p-0.5">
                    <IoCheckmark size={12} />
                  </div>
                )}

                {/* Missing/Required Indicator */}
                {slot.required && !hasSize && !isActive && (
                  <div className="absolute top-0 right-0 bg-red-500 w-2 h-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop List View */}
        <div className="hidden lg:block border-t border-gray-200 pt-6">
          <h3 className="font-black uppercase tracking-widest text-xs mb-4">
            Configuration ({slots.length} Items)
          </h3>
          <div className="space-y-1">
            {slots.map((slot, idx) => (
              <div
                key={slot.slotId}
                onClick={() => setActiveSlotIndex(idx)}
                className={`flex items-center gap-4 p-3 border cursor-pointer transition-colors ${
                  idx === activeSlotIndex
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-100 hover:border-gray-300"
                }`}
              >
                <div className="w-10 h-10 relative bg-white border border-gray-200">
                  {slot.product?.thumbnail?.url && (
                    <Image
                      src={slot.product.thumbnail.url}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm uppercase truncate">
                      {slot.label}
                    </span>
                    {slot.isFreeUnit && (
                      <span className="text-[9px] bg-green-500 text-white px-1 font-bold uppercase">
                        Free
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[10px] uppercase font-medium ${
                      idx === activeSlotIndex
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {selections[slot.slotId]?.isValid
                      ? `Selected: ${selections[slot.slotId].size}`
                      : "Select Size"}
                  </p>
                </div>
                {selections[slot.slotId]?.isValid && (
                  <IoCheckmark className="text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT: ACTIONS --- */}
      <div className="lg:w-[40%] relative">
        <div className="sticky top-24 flex flex-col gap-8">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-widest bg-black text-white px-2 py-0.5 uppercase">
                {pricing.label}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-[0.9] text-black">
              {combo.name}
            </h1>

            {combo.description && (
              <p className="text-gray-600 font-medium text-xs mt-4 uppercase tracking-wide leading-relaxed">
                {combo.description}
              </p>
            )}

            <div className="flex items-baseline gap-3 mt-6 pb-6 border-b border-black">
              <span className="text-4xl font-black tracking-tight text-black">
                Rs. {combo.comboPrice.toLocaleString()}
              </span>
              <span className="text-xl font-bold text-gray-400 line-through">
                Rs. {combo.originalPrice.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-green-600 uppercase tracking-wide">
                Save Rs. {pricing.savings.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Active Slot Controller */}
          {activeSlot && activeProduct && (
            <div
              className={`border p-5 ${
                activeSlot.isFreeUnit
                  ? "border-green-500 bg-green-50/20"
                  : "border-black bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">
                    Selection {activeSlotIndex + 1} of {slots.length}
                  </span>
                  <h3 className="text-sm font-black uppercase tracking-wide">
                    {activeProduct.name}
                  </h3>
                </div>
                {/* Variant Color Swatches */}
                {(() => {
                  // Filter variants based on restriction
                  const allowedVariants =
                    activeSlot.variantMode === "SPECIFIC_VARIANTS" &&
                    activeSlot.variantIds?.length
                      ? activeProduct.variants.filter((v) =>
                          activeSlot.variantIds!.includes(v.variantId)
                        )
                      : activeProduct.variants;

                  if (allowedVariants.length <= 1) return null;

                  return (
                    <div className="flex gap-1">
                      {allowedVariants.map((v) => (
                        <button
                          key={v.variantId}
                          onClick={() =>
                            handleVariantSelect(activeSlot.slotId, v.variantId)
                          }
                          className={`w-8 h-8 border-2 ${
                            activeSelection?.variantId === v.variantId
                              ? "border-black"
                              : "border-gray-200"
                          }`}
                        >
                          <Image
                            src={v.images?.[0]?.url || ""}
                            alt=""
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Size Grid */}
              {activeVariant?.sizes && activeVariant.sizes.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {activeVariant.sizes.map((size) => {
                    const stockInfo = getStockForSize(
                      activeSlot.slotId,
                      activeSelection?.variantId || "",
                      size
                    );
                    const isSelected = activeSelection?.size === size;
                    const isOutOfStock = stockInfo.isOutOfStock;

                    return (
                      <button
                        key={size}
                        onClick={() =>
                          handleSizeSelect(activeSlot.slotId, size)
                        }
                        disabled={isOutOfStock || stockInfo.loading}
                        className={`
                                        py-3 text-sm font-bold uppercase transition-all relative border
                                        ${
                                          isSelected
                                            ? "bg-black text-white border-black"
                                            : isOutOfStock
                                            ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed line-through"
                                            : "bg-white text-black border-gray-200 hover:border-black"
                                        }
                                    `}
                      >
                        {stockInfo.loading ? "..." : size}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-red-500 font-bold uppercase">
                  Please select a color
                </p>
              )}

              {/* Stock Status */}
              {activeSelection?.size && (
                <div className="mt-3 text-[10px] font-bold uppercase tracking-widest">
                  {(() => {
                    const stock = getStockForSlot(activeSlot.slotId);
                    const bagQty = getBagQty(
                      activeSlot.productId,
                      activeSelection.variantId,
                      activeSelection.size
                    );

                    if (stock?.quantity !== undefined) {
                      if (stock.quantity <= 0)
                        return <span className="text-red-600">Sold Out</span>;

                      if (bagQty + 1 > stock.quantity) {
                        return (
                          <span className="text-yellow-600">
                            Limit Reached ({bagQty} in bag)
                          </span>
                        );
                      }

                      return (
                        <span className="text-green-600">
                          {stock.quantity} In Stock
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

              {/* Next Button */}
              {activeSlotIndex < slots.length - 1 &&
                activeSelection?.isValid && (
                  <button
                    onClick={() => setActiveSlotIndex(activeSlotIndex + 1)}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Next Item <IoChevronForward />
                  </button>
                )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-1">
            <div
              className="bg-black h-1 transition-all duration-300"
              style={{
                width: `${
                  (slots.filter((s) => selections[s.slotId]?.isValid).length /
                    slots.length) *
                  100
                }%`,
              }}
            />
          </div>

          {/* Main Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToBag}
              disabled={!allSelectionsValid}
              className="w-full py-5 bg-black text-white text-sm font-black uppercase tracking-widest disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
            >
              {allSelectionsValid ? "Add Bundle to Bag" : "Complete Selection"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!allSelectionsValid}
              className="w-full py-5 border-2 border-black text-black text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>

            <div className="flex justify-center pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Help with ${combo.name}`}
                target="_blank"
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-green-600 transition-colors"
              >
                <FaWhatsapp size={14} /> Need sizing help? Chat with us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComboHero;
