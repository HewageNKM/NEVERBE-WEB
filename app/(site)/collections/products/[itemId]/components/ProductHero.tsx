"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  IoAdd,
  IoRemove,
  IoHeartOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AppDispatch, RootState } from "@/redux/store";
import { addToBag } from "@/redux/bagSlice/bagSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { KOKOLogo } from "@/assets/images";
import SizeGuideDialog from "@/components/SizeGuideDialog";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import UpsellNudge from "./UpsellNudge";

const ProductHero = ({ item }: { item: Product }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const { getPromotionForProduct } = usePromotionsContext();

  const [selectedImage, setSelectedImage] = useState(item.thumbnail);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    item.variants[0] || {
      id: "",
      variantId: "",
      variantName: "",
      images: [],
      sizes: [],
      status: true,
    }
  );

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1); // Start at 1 for better UX
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({}); // Stock per size
  const [stockLoading, setStockLoading] = useState(false);
  const [outOfStocks, setOutOfStocks] = useState(false);
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Calculate quantity already in bag
  const bagQty =
    bagItems.find(
      (b) =>
        b.itemId === item.id &&
        b.variantId === selectedVariant.variantId &&
        b.size === selectedSize
    )?.quantity || 0;

  const isLimitReached =
    selectedSize !== "" &&
    !stockLoading &&
    availableStock > 0 &&
    bagQty + qty > availableStock;

  // --- Init Logic ---
  useEffect(() => {
    if (item.variants?.length) {
      const defaultVariant = item.variants[0];
      setSelectedVariant(defaultVariant);
      setSelectedImage(defaultVariant.images[0] || item.thumbnail);
      // Don't auto-select size, let user choose (Nike style)
    }
  }, [item]);

  // --- Stock Logic: Batch preload all sizes for variant (SINGLE API call) ---
  const preloadStockForVariant = async (variantId: string, sizes: string[]) => {
    setStockLoading(true);
    try {
      // Single API call for all sizes
      const res = await fetch(
        `/api/v1/inventory/batch?productId=${
          item.id
        }&variantId=${variantId}&sizes=${sizes.join(",")}`
      );
      const data = await res.json();
      setSizeStock(data.stock || {});
    } catch (error) {
      console.error("Failed to preload stock:", error);
      // Fallback: set all sizes to 0
      const fallback: Record<string, number> = {};
      sizes.forEach((s) => (fallback[s] = 0));
      setSizeStock(fallback);
    } finally {
      setStockLoading(false);
    }
  };

  // Preload stock when variant changes
  useEffect(() => {
    if (selectedVariant.variantId && selectedVariant.sizes?.length) {
      preloadStockForVariant(selectedVariant.variantId, selectedVariant.sizes);
      setSelectedSize(""); // Reset size selection
    }
  }, [selectedVariant.variantId]);

  // Update available stock when size changes
  useEffect(() => {
    if (selectedSize && sizeStock[selectedSize] !== undefined) {
      setAvailableStock(sizeStock[selectedSize]);
    }
  }, [selectedSize, sizeStock]);

  useEffect(() => {
    setOutOfStocks(selectedSize !== "" && !stockLoading && availableStock <= 0);
  }, [availableStock, selectedSize, stockLoading]);

  // --- Bag Actions ---
  const handleAddToBag = () => {
    if (!selectedSize) return alert("Please select a size");
    if (outOfStocks) return;
    if (isLimitReached)
      return alert(
        `Limit reached! You already have ${bagQty} in bag and stock is ${availableStock}`
      );

    const bagItem = {
      itemId: item.id,
      variantId: selectedVariant.variantId,
      size: selectedSize,
      quantity: qty,
      price: item.sellingPrice,
      bPrice: 0, // Set server-side in OrderService
      name: item.name,
      thumbnail: selectedVariant.images[0]?.url || item.thumbnail.url,
      discount:
        Math.round((item.sellingPrice * (item.discount / 100)) / 10) * 10 * qty,
      itemType: "product",
      maxQuantity: 10,
      variantName: selectedVariant.variantName,
      category: item.category || "",
      brand: item.brand || "",
    };
    dispatch(addToBag(bagItem));
    // Optional: open bag drawer here
  };

  const buyNow = () => {
    handleAddToBag();
    router.push("/checkout");
  };

  const discountedPrice =
    Math.round(
      (item.discount > 0
        ? item.sellingPrice - (item.sellingPrice * item.discount) / 100
        : item.sellingPrice) / 10
    ) * 10;

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 pt-4 pb-12">
      {/* --- LEFT COLUMN: IMAGES (Scrollable) --- */}
      <div className="flex-1 lg:w-[60%] flex flex-col gap-4">
        {/* Main Image View - Sticky on Mobile, Static on Desktop Grid */}
        <div className="relative w-full aspect-square bg-[#f6f6f6] rounded-xl overflow-hidden cursor-zoom-in group">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={selectedImage.url}
                alt={item.name}
                fill
                priority
                className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </motion.div>
          </AnimatePresence>

          {item.discount > 0 && (
            <div className="absolute top-4 left-4 bg-white px-3 py-1 font-bold text-xs shadow-sm rounded-md">
              -{item.discount}%
            </div>
          )}
        </div>

        {/* Thumbnail Grid (If variant has multiple images) */}
        {selectedVariant.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {selectedVariant.images.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setSelectedImage(img)}
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square bg-[#f6f6f6] rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage.url === img.url
                    ? "border-black"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover mix-blend-multiply"
                />
              </button>
            ))}
          </div>
        )}

        {/* Description (Desktop Position) */}
        <div className="hidden lg:block mt-8">
          <h3 className="font-bold uppercase tracking-wide text-sm border-b border-gray-200 pb-2 mb-4">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
            {item.description ||
              "Designed for comfort and style, these sneakers feature premium materials and a modern silhouette perfect for everyday wear."}
          </p>
        </div>
      </div>

      {/* --- RIGHT COLUMN: DETAILS (Sticky) --- */}
      <div className="lg:w-[40%] relative">
        <div className="sticky top-24 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h2 className="text-black font-medium text-lg capitalize mb-1">
              {item.brand?.replace("-", " ")}
            </h2>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-black mb-4">
              {item.name}
            </h1>

            {/* Price & Promo Section */}
            <div className="flex flex-col gap-2">
              {(() => {
                const activePromo = getPromotionForProduct(
                  item.id,
                  selectedVariant.variantId
                );

                // Calculate final price logic locally for display
                let finalPrice = item.sellingPrice;
                if (item.discount > 0) {
                  finalPrice =
                    Math.round(
                      (item.sellingPrice -
                        (item.sellingPrice * item.discount) / 100) /
                        10
                    ) * 10;
                }

                if (activePromo) {
                  if (
                    activePromo.type === "PERCENTAGE" &&
                    activePromo.actions?.[0]?.value
                  ) {
                    const discountVal = activePromo.actions[0].value;
                    finalPrice =
                      Math.round(
                        (finalPrice * (100 - discountVal)) / 100 / 10
                      ) * 10;
                  } else if (
                    activePromo.type === "FIXED" &&
                    activePromo.actions?.[0]?.value
                  ) {
                    finalPrice = Math.max(
                      0,
                      finalPrice - activePromo.actions[0].value
                    );
                  }
                }

                return (
                  <>
                    <div className="flex items-center gap-4">
                      <span
                        className={`${
                          item.discount > 0 || activePromo
                            ? "text-red-600"
                            : "text-black"
                        } text-xl font-bold`}
                      >
                        Rs. {finalPrice.toLocaleString()}
                      </span>
                      {/* Only show standard discount if NO active promo to avoid confusion */}
                      {item.discount > 0 && !activePromo && (
                        <span className="text-gray-400 line-through text-base">
                          Rs. {item.marketPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Active Promotion Display */}
                    {activePromo && (
                      <div className="bg-black text-white text-xs font-bold px-3 py-2 uppercase tracking-wide rounded-sm inline-block self-start animate-pulse">
                        {activePromo.type === "BOGO"
                          ? "Buy 1 Get 1 Free"
                          : activePromo.name || "Special Offer Applied"}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* KOKO */}
            <div className="flex items-center gap-2 mt-2 opacity-60">
              <span className="text-[10px] uppercase font-bold text-gray-500">
                Pay in 3 with
              </span>
              <Image src={KOKOLogo} alt="Koko" width={40} height={15} />
            </div>
          </div>

          {/* Colors */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold uppercase">Select Color</span>
              <span className="text-sm text-gray-500 capitalize">
                {selectedVariant.variantName}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {item.variants.map((v) => {
                const isPromoEligible = !!getPromotionForProduct(
                  item.id,
                  v.variantId
                );
                return (
                  <button
                    key={v.variantId}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedImage(v.images[0]);
                      setSelectedSize("");
                    }}
                    className={`h-20 w-20 bg-[#f6f6f6] rounded-md overflow-hidden border-2 transition-all relative ${
                      selectedVariant.variantId === v.variantId
                        ? "border-black"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={v.images[0].url}
                        alt={v.variantName}
                        fill
                        className="object-cover mix-blend-multiply"
                      />
                    </div>
                    {isPromoEligible && (
                      <div
                        className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-white z-10"
                        title="Promotion Available"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold uppercase">Select Size</span>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-gray-400 underline hover:text-black"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {selectedVariant.sizes.map((size) => {
                const stockQty = sizeStock[size];
                const isOutOfStock = stockQty !== undefined && stockQty <= 0;
                const isLoading = stockLoading && stockQty === undefined;

                return (
                  <button
                    key={size}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock || isLoading}
                    className={`py-3 rounded-md text-sm font-bold border transition-all relative ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : isOutOfStock
                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                        : "border-gray-200 text-black hover:border-black"
                    }`}
                  >
                    {isLoading ? "..." : size}
                    {isOutOfStock && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
            {!selectedSize && (
              <p className="text-red-500 text-xs mt-2 font-medium">
                * Please select a size
              </p>
            )}

            {/* Stock Indicator */}
            {selectedSize && (
              <div className="mt-2 text-xs font-bold uppercase tracking-wide">
                {stockLoading ? (
                  <span className="text-gray-400">Checking Stock...</span>
                ) : availableStock > 0 ? (
                  isLimitReached ? (
                    <span className="text-yellow-600">
                      Limit Reached ({bagQty} in bag)
                    </span>
                  ) : availableStock < 5 ? (
                    <span className="text-red-600 animate-pulse">
                      Only {availableStock} Left!
                    </span>
                  ) : (
                    <span className="text-green-600">
                      {availableStock} In Stock
                    </span>
                  )
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <span className="text-sm font-bold uppercase block mb-2">
              Quantity
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                disabled={qty <= 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-md text-lg font-bold hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IoRemove size={18} />
              </button>
              <span className="text-lg font-bold w-8 text-center">{qty}</span>
              <button
                onClick={() =>
                  setQty((prev) =>
                    Math.min(availableStock - bagQty || 10, prev + 1)
                  )
                }
                disabled={
                  qty >= availableStock - bagQty ||
                  qty >= 10 ||
                  availableStock === 0
                }
                className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-md text-lg font-bold hover:border-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IoAdd size={18} />
              </button>
            </div>
            {bagQty > 0 && selectedSize && (
              <p className="text-xs text-gray-500 mt-1">
                You have {bagQty} in your bag.
              </p>
            )}
          </div>

          {/* Upsell Nudge */}
          <UpsellNudge
            activePromo={getPromotionForProduct(
              item.id,
              selectedVariant.variantId
            )}
            currentQty={qty + bagQty}
            currentAmount={(qty + bagQty) * item.sellingPrice}
          />

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleAddToBag}
              disabled={!selectedSize || outOfStocks || isLimitReached}
              className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              {isLimitReached
                ? "Limit Reached"
                : outOfStocks
                ? "Out of Stock"
                : "Add to Bag"}
            </button>

            <button
              onClick={buyNow}
              disabled={!selectedSize || outOfStocks || isLimitReached}
              className="w-full py-4 border border-black text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
            >
              Buy It Now
            </button>

            {/* Secondary Actions */}
            <div className="flex gap-2 justify-center mt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm interested in ${item.name}`}
                target="_blank"
                className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 hover:text-green-600 py-2"
              >
                <FaWhatsapp size={16} /> WhatsApp Inquiry
              </a>
            </div>
          </div>

          {/* Mobile Description (Visible only on mobile) */}
          <div className="block lg:hidden mt-6 border-t border-gray-100 pt-6">
            <h3 className="font-bold uppercase tracking-wide text-sm mb-2">
              Description
            </h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        </div>
      </div>
      <SizeGuideDialog
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </section>
  );
};

export default ProductHero;
