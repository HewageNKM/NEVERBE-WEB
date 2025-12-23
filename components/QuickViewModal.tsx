"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoAdd, IoRemove, IoFlash } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";
import { addToBag } from "@/redux/bagSlice/bagSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import {
  calculateFinalPrice,
  getOriginalPrice,
  hasDiscount as checkHasDiscount,
} from "@/utils/pricing";
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

  const activePromo = getPromotionForProduct(
    product.id,
    selectedVariant?.variantId
  );
  const finalPrice = calculateFinalPrice(product, activePromo);
  const originalPrice = getOriginalPrice(product);
  const hasActiveDiscount = checkHasDiscount(product, activePromo);
  const discountPerUnit = originalPrice - finalPrice;

  const availableStock = sizeStock[selectedSize] || 0;
  const bagQty =
    bagItems.find(
      (b) =>
        b.itemId === product.id &&
        b.variantId === selectedVariant?.variantId &&
        b.size === selectedSize
    )?.quantity || 0;

  const isOutOfStock = selectedSize && availableStock <= 0;
  const isLimitReached = selectedSize && bagQty + qty > availableStock;

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
        discount: discountPerUnit * qty,
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
            className="relative bg-surface w-full max-w-6xl h-[94vh] md:h-auto md:max-h-[90vh] shadow-hover overflow-hidden rounded-t-[2.5rem] md:rounded-2xl border-t border-default"
          >
            {/* Top Close Bar (Mobile) */}
            <div className="md:hidden flex justify-center py-4">
              <div className="w-12 h-1.5 bg-border-primary rounded-full" />
            </div>

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-3 bg-surface-2 md:bg-dark text-primary md:text-inverse rounded-full hover:bg-accent hover:text-dark transition-all shadow-custom"
            >
              <IoClose size={24} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto hide-scrollbar">
              {/* LEFT: VISUALS SECTION */}
              <div className="w-full md:w-1/2 flex flex-col bg-surface-2 border-r border-default shrink-0">
                <div className="relative aspect-square flex items-center justify-center p-8 md:p-16">
                  {/* Performance Glow behind product */}
                  <div className="absolute inset-0 bg-accent/5 rounded-full blur-[120px] scale-75" />
                  <Image
                    src={
                      selectedVariant?.images?.[0]?.url || product.thumbnail.url
                    }
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-contain mix-blend-multiply relative z-10 transition-transform duration-700 md:hover:scale-110"
                    priority
                  />
                </div>

                {/* Variant Swatches */}
                {product.variants.length > 1 && (
                  <div className="px-6 pb-8 md:pb-12 flex gap-4 overflow-x-auto hide-scrollbar justify-start md:justify-center">
                    {product.variants.map((v) => (
                      <button
                        key={v.variantId}
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedSize("");
                        }}
                        className={`relative w-16 h-16 shrink-0 bg-surface transition-all rounded-lg p-1.5 ${
                          selectedVariant?.variantId === v.variantId
                            ? "border-accent border-2 shadow-custom scale-110 z-10"
                            : "border-border-primary hover:border-accent opacity-60 hover:opacity-100"
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
              <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col bg-surface">
                {/* Branded Promotion Banner */}
                <AnimatePresence>
                  {activePromo && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-accent text-dark p-4 mb-8 -mx-8 md:-mx-12 lg:-mx-16 px-8 md:px-12 lg:px-16 flex items-center gap-3 shadow-custom"
                    >
                      <IoFlash className="animate-pulse" size={20} />
                      <div className="flex-1">
                        <p className="text-sm font-display font-black uppercase italic tracking-tighter">
                          {activePromo.name || "Special Performance Offer"}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-80">
                          Applied to this selection automatically
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mb-8">
                  <p className="text-accent text-xs font-black uppercase tracking-[0.2em] mb-2 italic">
                    {activePromo
                      ? "Vibrant Deal"
                      : product.brand?.replace("-", " ")}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-primary leading-tight uppercase italic tracking-tighter">
                    {product.name}
                  </h2>
                </div>

                {/* Performance Pricing Area */}
                <div className="flex items-center gap-4 mb-10">
                  <span
                    className={`text-3xl font-display font-black italic tracking-tighter ${
                      hasActiveDiscount ? "text-success" : "text-primary"
                    }`}
                  >
                    Rs. {finalPrice.toLocaleString()}
                  </span>
                  {hasActiveDiscount && (
                    <span className="text-muted text-lg line-through decoration-border-dark">
                      Rs. {originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Size Grid - Integrated with Brand Styling */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-sm font-black uppercase tracking-widest text-primary">
                      Select Size
                    </p>
                    <button className="text-[10px] font-bold uppercase text-accent hover:text-primary transition-colors underline underline-offset-4">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-black uppercase tracking-widest text-primary">
                      Quantity
                    </span>
                    <div className="flex items-center bg-surface-2 border border-border-primary rounded-full px-4 py-2">
                      <button
                        onClick={() => setQty((p) => Math.max(1, p - 1))}
                        className="p-1 hover:text-accent disabled:opacity-10 transition-colors"
                        disabled={qty <= 1}
                      >
                        <IoRemove size={20} />
                      </button>
                      <span className="w-12 text-center text-base font-display font-black italic tracking-tighter">
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
                        <IoAdd size={20} />
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
                        className={`text-xs font-black uppercase tracking-tighter italic ${
                          availableStock < 5 ? "text-error" : "text-success"
                        }`}
                      >
                        {availableStock < 5
                          ? `Urgent: Only ${availableStock} Left`
                          : "Available In Store"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Performance Pills */}
                <div className="mt-auto space-y-4 pb-8 md:pb-0">
                  <button
                    onClick={handleAddToBag}
                    disabled={!selectedSize || isOutOfStock || isLimitReached}
                    className="group w-full py-5 bg-dark text-inverse rounded-full font-display font-black uppercase italic tracking-[0.15em] text-sm md:text-base transition-all hover:bg-accent hover:text-dark hover:shadow-hover active:scale-95 disabled:bg-surface-3 disabled:text-muted disabled:cursor-not-allowed"
                  >
                    {isOutOfStock
                      ? "Sold Out"
                      : isLimitReached
                      ? "Inventory Maxed"
                      : "Boost to Bag"}
                  </button>

                  <Link
                    href={`/collections/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center w-full py-4 border-2 border-border-dark rounded-full font-black text-xs uppercase tracking-[0.2em] text-primary hover:bg-surface-2 hover:border-dark transition-all"
                  >
                    View Product Blueprint
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
