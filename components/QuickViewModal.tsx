"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoAdd, IoRemove, IoFlash } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/redux/store";
import { addToBag } from "@/redux/bagSlice/bagSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import SizeGrid from "@/components/SizeGrid";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const { getPromotionForProduct } = usePromotionsContext();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState(false);

  useEffect(() => {
    if (product) {
      const defaultVariant = product.variants?.[0] || null;
      setSelectedVariant(defaultVariant);
      setSelectedSize("");
      setQty(1);
      setSizeStock({});
    }
  }, [product]);

  useEffect(() => {
    if (
      !product ||
      !selectedVariant?.variantId ||
      !selectedVariant?.sizes?.length
    )
      return;

    const loadStock = async () => {
      setStockLoading(true);
      try {
        const res = await fetch(
          `/api/v1/inventory/batch?productId=${product.id}&variantId=${
            selectedVariant.variantId
          }&sizes=${selectedVariant.sizes.join(",")}`
        );
        const data = await res.json();
        setSizeStock(data.stock || {});
      } catch {
        setSizeStock({});
      } finally {
        setStockLoading(false);
      }
    };
    loadStock();
  }, [product?.id, selectedVariant?.variantId]);

  if (!isOpen || !product) return null;

  // Get promotion for display purposes only (banner)
  const activePromo = getPromotionForProduct(
    product.id,
    selectedVariant?.variantId
  );

  // Use only product-level pricing (no promotion in calculations)
  const finalPrice = product.sellingPrice;
  const originalPrice = product.marketPrice;
  const hasActiveDiscount = product.marketPrice > product.sellingPrice;

  const availableStock = sizeStock[selectedSize] || 0;
  const bagQty =
    bagItems.find(
      (b) =>
        b.itemId === product.id &&
        b.variantId === selectedVariant?.variantId &&
        b.size === selectedSize
    )?.quantity || 0;

  const isOutOfStock = Boolean(selectedSize && availableStock <= 0);
  const isLimitReached = Boolean(selectedSize && bagQty + qty > availableStock);

  const handleAddToBag = () => {
    if (!selectedSize || !selectedVariant) return;

    dispatch(
      addToBag({
        itemId: product.id,
        variantId: selectedVariant.variantId,
        size: selectedSize,
        quantity: qty,
        price: finalPrice,
        bPrice: 0,
        name: product.name,
        thumbnail: selectedVariant.images[0]?.url || product.thumbnail.url,
        discount: 0, // No discount - marketPrice is just decoration
        itemType: "product",
        maxQuantity: 10,
        variantName: selectedVariant.variantName,
        category: product.category || "",
        brand: product.brand || "",
      })
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
          {/* Backdrop with high-performance blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative bg-surface w-full max-w-6xl h-[92vh] md:h-[85vh] shadow-hover overflow-hidden rounded-t-3xl md:rounded-2xl border-t md:border border-default"
          >
            {/* Top Drag Handle (Mobile) */}
            <div className="md:hidden flex justify-center py-3 sticky top-0 bg-surface z-40">
              <div className="w-10 h-1 bg-border-dark rounded-full" />
            </div>

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="hidden md:flex absolute top-4 right-4 z-50 p-2.5 bg-dark text-inverse rounded-full hover:bg-accent hover:text-dark transition-all shadow-custom"
            >
              <IoClose size={20} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto hide-scrollbar">
              {/* LEFT: VISUALS SECTION */}
              <div className="w-full md:w-1/2 flex flex-col bg-surface-2 md:border-r border-default shrink-0">
                <div className="relative aspect-square md:aspect-auto md:min-h-[400px] md:flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
                  {/* Performance Glow behind product */}
                  <div className="absolute inset-0 bg-accent/5 rounded-full blur-[100px] scale-50 md:scale-75" />
                  <Image
                    src={
                      selectedVariant?.images?.[0]?.url || product.thumbnail.url
                    }
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full max-h-[50vh] md:max-h-full object-contain mix-blend-multiply relative z-10 transition-transform duration-700"
                    priority
                  />
                </div>

                {/* Variant Swatches */}
                {product.variants.length > 1 && (
                  <div className="px-4 sm:px-6 py-4 md:py-6 flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar justify-start md:justify-center bg-surface-2 border-t border-default md:border-t-0">
                    {product.variants.map((v) => (
                      <button
                        key={v.variantId}
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedSize("");
                        }}
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-surface transition-all rounded-lg p-1 ${
                          selectedVariant?.variantId === v.variantId
                            ? "border-accent border-2 shadow-custom scale-105 z-10"
                            : "border border-default hover:border-accent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={v.images[0]?.url || ""}
                            alt={v.variantName}
                            fill
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: DETAILS SECTION */}
              <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 lg:p-12 flex flex-col bg-surface">
                {/* Promotion Banner - Display Only */}
                <AnimatePresence>
                  {activePromo && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-accent text-dark p-3 sm:p-4 mb-4 sm:mb-6 -mx-4 sm:-mx-6 md:-mx-10 lg:-mx-12 px-4 sm:px-6 md:px-10 lg:px-12 flex items-center gap-2 sm:gap-3 shadow-custom"
                    >
                      <IoFlash className="animate-pulse shrink-0" size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-display font-black uppercase italic tracking-tighter truncate">
                          {activePromo.name || "Special Offer"}
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-80 hidden sm:block">
                          Limited Time Offer
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-4 sm:mb-6">
                  <p className="text-accent text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1 sm:mb-2 italic">
                    {product.brand?.replace("-", " ")}
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-primary leading-tight uppercase italic tracking-tighter">
                    {product.name}
                  </h2>
                </div>

                {/* Performance Pricing Area */}
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <span
                    className={`text-2xl sm:text-3xl font-display font-black italic tracking-tighter ${
                      hasActiveDiscount ? "text-success" : "text-primary"
                    }`}
                  >
                    Rs. {finalPrice.toLocaleString()}
                  </span>
                  {hasActiveDiscount && (
                    <span className="text-muted text-sm sm:text-lg line-through decoration-border-dark">
                      Rs. {originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Size Grid - Integrated with Brand Styling */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-primary">
                      Select Size
                    </p>
                    <button className="text-[9px] sm:text-[10px] font-bold uppercase text-accent hover:text-primary transition-colors underline underline-offset-4">
                      Size Guide
                    </button>
                  </div>
                  <SizeGrid
                    sizes={selectedVariant?.sizes || []}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                    stockMap={sizeStock}
                    stockLoading={stockLoading}
                  />
                </div>

                {/* Quantity Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-primary">
                      Quantity
                    </span>
                    <div className="flex items-center bg-surface-2 border border-default rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                      <button
                        onClick={() => setQty((p) => Math.max(1, p - 1))}
                        className="p-1 hover:text-accent disabled:opacity-10 transition-colors"
                        disabled={qty <= 1}
                      >
                        <IoRemove size={18} />
                      </button>
                      <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-display font-black italic tracking-tighter">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          setQty((p) =>
                            Math.min(availableStock - bagQty || 10, p + 1)
                          )
                        }
                        className="p-1 hover:text-accent disabled:opacity-10 transition-colors"
                        disabled={qty >= availableStock - bagQty || qty >= 10}
                      >
                        <IoAdd size={18} />
                      </button>
                    </div>
                  </div>

                  {selectedSize && !stockLoading && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          availableStock < 5
                            ? "bg-error animate-ping"
                            : "bg-success"
                        }`}
                      />
                      <span
                        className={`text-[10px] sm:text-xs font-black uppercase tracking-tighter italic ${
                          availableStock < 5 ? "text-error" : "text-success"
                        }`}
                      >
                        {availableStock < 5
                          ? `Urgent: Only ${availableStock} Left`
                          : "In Stock"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Performance Pills */}
                <div className="mt-auto space-y-3 pb-6 sm:pb-4 md:pb-0">
                  <button
                    onClick={handleAddToBag}
                    disabled={!selectedSize || isOutOfStock || isLimitReached}
                    className="group w-full py-4 sm:py-5 bg-dark text-inverse rounded-full font-display font-black uppercase italic tracking-wider text-xs sm:text-sm transition-all hover:bg-accent hover:text-dark hover:shadow-hover active:scale-[0.98] disabled:bg-surface-3 disabled:text-muted disabled:cursor-not-allowed"
                  >
                    {isOutOfStock
                      ? "Sold Out"
                      : isLimitReached
                      ? "Inventory Maxed"
                      : "Add to Bag"}
                  </button>

                  <Link
                    href={`/collections/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center w-full py-3 sm:py-4 border-2 border-default rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest text-primary hover:bg-surface-2 hover:border-dark transition-all"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
