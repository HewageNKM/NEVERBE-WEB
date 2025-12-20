"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { FaWhatsapp, FaTruckFast, FaArrowRotateLeft } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/redux/store";
import { addToBag } from "@/redux/bagSlice/bagSlice";
import {
  toggleWishlist,
  hydrateWishlist,
  WishlistItem,
} from "@/redux/wishlistSlice/wishlistSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { KOKOLogo } from "@/assets/images";
import SizeGuideDialog from "@/components/SizeGuideDialog";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import UpsellNudge from "./UpsellNudge";
import StockBadge from "@/components/StockBadge";
import ShareButtons from "@/components/ShareButtons";
import FloatingAddToBag from "@/components/FloatingAddToBag";
import SizeGrid from "@/components/SizeGrid";

const ProductHero = ({ item }: { item: Product }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { getPromotionForProduct } = usePromotionsContext();

  // Hydrate wishlist from localStorage on mount
  useEffect(() => {
    dispatch(hydrateWishlist());
  }, [dispatch]);

  const [selectedImage, setSelectedImage] = useState(item.thumbnail);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    item.variants[0]
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Get current active promotion
  const activePromo = getPromotionForProduct(
    item.id,
    selectedVariant.variantId
  );

  useEffect(() => {
    if (selectedVariant.images?.length) {
      setSelectedImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

  useEffect(() => {
    const fetchStock = async () => {
      setStockLoading(true);
      try {
        const res = await fetch(
          `/api/v1/inventory/batch?productId=${item.id}&variantId=${
            selectedVariant.variantId
          }&sizes=${selectedVariant.sizes.join(",")}`
        );
        const data = await res.json();
        setSizeStock(data.stock || {});
      } catch (e) {
        console.error(e);
      } finally {
        setStockLoading(false);
      }
    };
    fetchStock();
  }, [selectedVariant.variantId, item.id]);

  const availableStock = selectedSize ? sizeStock[selectedSize] ?? 0 : 0;
  const bagQty =
    bagItems.find(
      (b) =>
        b.itemId === item.id &&
        b.variantId === selectedVariant.variantId &&
        b.size === selectedSize
    )?.quantity || 0;
  const isLimitReached =
    selectedSize !== "" && availableStock > 0 && bagQty + qty > availableStock;

  // Check if current variant is in wishlist
  const isInWishlist = wishlistItems.some(
    (w) => w.productId === item.id && w.variantId === selectedVariant.variantId
  );

  const handleToggleWishlist = () => {
    const wishlistItem: WishlistItem = {
      productId: item.id,
      variantId: selectedVariant.variantId,
      name: item.name,
      thumbnail: selectedVariant.images[0]?.url || item.thumbnail.url,
      price: item.sellingPrice,
      addedAt: new Date().toISOString(),
    };
    dispatch(toggleWishlist(wishlistItem));
  };

  const handleAddToBag = () => {
    if (!selectedSize) return;
    dispatch(
      addToBag({
        itemId: item.id,
        variantId: selectedVariant.variantId,
        size: selectedSize,
        quantity: qty,
        price: item.sellingPrice,
        name: item.name,
        thumbnail: selectedVariant.images[0]?.url || item.thumbnail.url,
        itemType: "product",
        variantName: selectedVariant.variantName,
      } as any)
    );
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-6 flex flex-col lg:flex-row gap-10 lg:gap-16">
      {/* --- LEFT COLUMN: IMAGES --- */}
      <div className="flex-1 lg:w-3/5 flex flex-col gap-4">
        <div className="relative aspect-square bg-[#f6f6f6] rounded-sm overflow-hidden group">
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
                className="object-cover mix-blend-multiply"
              />
            </motion.div>
          </AnimatePresence>

          {/* Discount Badge */}
          {item.discount > 0 && (
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
              {item.discount}% Off
            </div>
          )}
        </div>

        <div className="grid grid-cols-6 gap-2">
          {selectedVariant.images.map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setSelectedImage(img)}
              className={`relative aspect-square bg-[#f6f6f6] rounded-sm overflow-hidden border-2 transition-all ${
                selectedImage.url === img.url
                  ? "border-black"
                  : "border-transparent opacity-70"
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
      </div>

      {/* --- RIGHT COLUMN: DETAILS --- */}
      <div className="lg:w-2/5 relative">
        <div className="lg:sticky lg:top-24 flex flex-col gap-6">
          {/* Promotion Header Banner */}
          {activePromo && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3">
              <p className="text-red-700 text-xs font-black uppercase tracking-widest animate-pulse">
                {activePromo.name || "Special Offer Applied"}
              </p>
              <p className="text-[10px] text-red-600 mt-1 uppercase font-bold">
                Limited time only. While stocks last.
              </p>
            </div>
          )}

          <header>
            <h2 className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-1">
              {activePromo ? "Promotion Active" : item.brand?.replace("-", " ")}
            </h2>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              {item.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">
                Rs. {item.sellingPrice.toLocaleString()}
              </span>
              {item.discount > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  Rs. {item.marketPrice.toLocaleString()}
                </span>
              )}

              {/* Stock Urgency Badge */}
              {selectedSize && (
                <StockBadge stockCount={availableStock} className="mt-2" />
              )}
            </div>

            {/* Value Props Ticker */}
            <div className="flex gap-4 mt-6 border-y border-gray-100 py-3">
              <div className="flex items-center gap-2">
                <FaTruckFast className="text-gray-400" size={14} />
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  Standard Shipping 2-3 Days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaArrowRotateLeft className="text-gray-400" size={14} />
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  Size Exchange
                </span>
              </div>
            </div>
          </header>

          {/* Color & Size Selection (Existing Logic) */}
          <div>
            <h3 className="text-xs font-bold uppercase mb-3 text-gray-400">
              Select Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.variants.map((v) => (
                <button
                  key={v.variantId}
                  onClick={() => {
                    setSelectedVariant(v);
                    setSelectedSize("");
                  }}
                  className={`w-12 h-12 bg-[#f6f6f6] rounded-md overflow-hidden border-2 transition-all ${
                    selectedVariant.variantId === v.variantId
                      ? "border-black"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <Image
                    src={v.images[0].url}
                    alt={v.variantName}
                    width={48}
                    height={48}
                    className="object-cover mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase text-gray-400">
                Select Size
              </h3>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-gray-500 underline"
              >
                Size Guide
              </button>
            </div>
            <SizeGrid
              sizes={selectedVariant.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              stockMap={sizeStock}
              stockLoading={stockLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-4">
            <UpsellNudge
              activePromo={activePromo}
              currentQty={qty + bagQty}
              currentAmount={(qty + bagQty) * item.sellingPrice}
            />

            <div className="flex gap-3">
              <button
                onClick={handleAddToBag}
                disabled={
                  !selectedSize || availableStock === 0 || isLimitReached
                }
                className="flex-1 py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all disabled:bg-gray-100 disabled:text-gray-400"
              >
                {isLimitReached
                  ? "Limit Reached"
                  : availableStock === 0 && selectedSize
                  ? "Out of Stock"
                  : "Add to Bag"}
              </button>

              {/* Wishlist Toggle */}
              <button
                onClick={handleToggleWishlist}
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                  isInWishlist
                    ? "bg-black border-black text-white"
                    : "bg-white border-gray-200 text-black hover:border-black"
                }`}
                aria-label={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isInWishlist ? (
                  <IoHeart size={24} />
                ) : (
                  <IoHeartOutline size={24} />
                )}
              </button>
            </div>

            {/* Koko Installment Offer */}
            <div className="flex items-center justify-center gap-2 p-3 bg-zinc-50 rounded-xl">
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                Or 3 Interest-Free payments of Rs.{" "}
                {(item.sellingPrice / 3).toFixed(0)} with
              </span>
              <Image src={KOKOLogo} alt="Koko" width={35} height={12} />
            </div>
          </div>

          {/* Share & Help Section */}
          <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
            {/* Social Share Buttons */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-gray-400">
                Share
              </span>
              <ShareButtons
                title={item.name}
                url={`/collections/products/${item.id}`}
              />
            </div>

            {/* WhatsApp Specialist */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-green-600"
            >
              <FaWhatsapp size={16} /> Chat with a specialist
            </a>
          </div>
        </div>
      </div>
      <SizeGuideDialog
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />

      {/* Floating Add to Bag - Mobile/Tablet */}
      <FloatingAddToBag
        productName={item.name}
        price={item.sellingPrice}
        selectedSize={selectedSize}
        canAddToBag={!!selectedSize && (sizeStock[selectedSize] ?? 0) > 0}
        onAddToBag={handleAddToBag}
      />
    </section>
  );
};

export default ProductHero;
