"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  IoHeartOutline,
  IoHeart,
  IoAddOutline,
  IoRemoveOutline,
} from "react-icons/io5";
import { FaWhatsapp, FaTruckFast, FaArrowRotateLeft } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
import {
  ProductVariantTarget,
  PromotionCondition,
} from "@/interfaces/Promotion";
import { isVariantEligibleForPromotion } from "@/utils/promotionUtils";
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
  // Track stock for ALL variants (variantId -> total stock)
  const [allVariantStock, setAllVariantStock] = useState<
    Record<string, number>
  >({});

  // Get promotion for display purposes only (banner)
  const activePromo = getPromotionForProduct(
    item.id,
    selectedVariant.variantId
  );

  // Use only product-level pricing (no promotion in calculations)
  const finalPrice = item.sellingPrice;
  const originalPrice = item.marketPrice;
  const hasActiveDiscount = item.marketPrice > item.sellingPrice;

  // Helper to check if a variant has a promotion indicator
  const getVariantPromotion = (variantId: string) => {
    const promo = getPromotionForProduct(item.id, variantId);
    if (!promo) return null;

    // Check variant eligibility using both applicableProductVariants and conditions
    const isEligible = isVariantEligibleForPromotion(
      item.id,
      variantId,
      promo.applicableProductVariants as ProductVariantTarget[] | undefined,
      promo.conditions as PromotionCondition[] | undefined
    );

    return isEligible ? promo : null;
  };

  useEffect(() => {
    if (selectedVariant.images?.length) {
      setSelectedImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

  // Preload stock for ALL variants on component mount
  useEffect(() => {
    if (!item.variants?.length) return;

    const loadAllVariantStock = async () => {
      const stockMap: Record<string, number> = {};

      // Fetch stock for each variant in parallel
      const promises = item.variants.map(async (variant) => {
        if (!variant.sizes?.length) {
          stockMap[variant.variantId] = 0;
          return;
        }

        try {
          const res = await fetch(
            `/api/v1/inventory/batch?productId=${item.id}&variantId=${
              variant.variantId
            }&sizes=${variant.sizes.join(",")}`
          );
          const data = await res.json();
          // Sum up total stock for this variant
          const totalStock = Object.values(data.stock || {}).reduce(
            (sum: number, qty: unknown) => sum + (Number(qty) || 0),
            0
          );
          stockMap[variant.variantId] = totalStock;
        } catch {
          stockMap[variant.variantId] = 0;
        }
      });

      await Promise.all(promises);
      setAllVariantStock(stockMap);
    };

    loadAllVariantStock();
  }, [item.id]);

  // Load stock for selected variant (for size grid)
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
    const productDiscount =
      Math.round(((item.discount / 100) * item.sellingPrice * qty) / 10) * 10;
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
        discount: productDiscount,
        maxQuantity: 10,
        category: item.category || "",
        brand: item.brand || "",
      } as any)
    );
    toast.success(`Added ${qty} item${qty > 1 ? "s" : ""} to bag`);
    setQty(1); // Reset quantity after adding
  };

  return (
    <section className="max-w-content mx-auto px-4 md:px-10 py-6 flex flex-col lg:flex-row gap-10 lg:gap-16">
      {/* --- LEFT COLUMN: IMAGES --- */}
      <div className="flex-1 lg:w-3/5 flex flex-col gap-4">
        <div className="relative aspect-square bg-surface-2 rounded-sm overflow-hidden group">
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

          {/* Discount Badge - Branded */}
          {item.discount > 0 && (
            <div className="absolute top-4 left-4 bg-accent text-dark px-4 py-2 font-display font-black text-xs uppercase italic tracking-tighter shadow-custom">
              {item.discount}% Off
            </div>
          )}
        </div>

        <div className="grid grid-cols-6 gap-2">
          {selectedVariant.images.map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setSelectedImage(img)}
              className={`relative aspect-square bg-surface-2 rounded-sm overflow-hidden border-2 transition-all ${
                selectedImage.url === img.url
                  ? "border-dark"
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
          {/* Promotion Banner - Display Only */}
          {activePromo && (
            <div className="bg-accent text-dark p-4 flex items-center gap-3 shadow-custom">
              <p className="text-sm font-display font-black uppercase italic tracking-tighter">
                {activePromo.name || "Special Offer"}
              </p>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">
                Limited Time
              </span>
            </div>
          )}

          <header>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-2 italic">
              {item.brand?.replace("-", " ")}
            </h2>
            <h1 className="text-4xl lg:text-5xl font-display font-black uppercase italic tracking-tighter leading-[0.9] mb-4 text-primary">
              {item.name}
            </h1>
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-3xl font-display font-black italic tracking-tighter text-primary">
                Rs. {finalPrice.toLocaleString()}
              </span>
              {hasActiveDiscount && (
                <span className="text-muted line-through text-base decoration-border-dark">
                  Rs. {originalPrice.toLocaleString()}
                </span>
              )}
              {hasActiveDiscount && (
                <span className="bg-success text-dark text-[10px] font-black px-3 py-1 uppercase tracking-widest italic shadow-custom">
                  Save Rs. {(originalPrice - finalPrice).toLocaleString()}
                </span>
              )}

              {/* Stock Urgency Badge */}
              {selectedSize && (
                <StockBadge stockCount={availableStock} className="mt-2" />
              )}
            </div>

            {/* Value Props Ticker */}
            <div className="flex gap-4 mt-6 border-y border-default py-3">
              <div className="flex items-center gap-2">
                <FaTruckFast className="text-muted" size={14} />
                <span className="text-[10px] font-bold uppercase text-secondary">
                  Standard Shipping 2-3 Days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaArrowRotateLeft className="text-muted" size={14} />
                <span className="text-[10px] font-bold uppercase text-secondary">
                  Size Exchange
                </span>
              </div>
            </div>
          </header>

          {/* Color & Size Selection (Existing Logic) */}
          <div>
            <h3 className="text-xs font-bold uppercase mb-3 text-muted">
              Select Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.variants.map((v) => {
                // Check if this specific variant is eligible for a promotion
                const variantPromo = getVariantPromotion(v.variantId);
                // Check if variant is out of stock
                const variantTotalStock = allVariantStock[v.variantId];
                const isVariantOutOfStock =
                  variantTotalStock !== undefined && variantTotalStock <= 0;

                return (
                  <button
                    key={v.variantId}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedSize("");
                    }}
                    disabled={isVariantOutOfStock}
                    className={`relative w-12 h-12 bg-surface-2 rounded-md overflow-hidden border-2 transition-all ${
                      selectedVariant.variantId === v.variantId
                        ? "border-dark"
                        : "border-transparent opacity-60"
                    } ${
                      isVariantOutOfStock ? "opacity-40 cursor-not-allowed" : ""
                    }`}
                    title={
                      isVariantOutOfStock
                        ? `${v.variantName} - Out of Stock`
                        : variantPromo
                        ? `${v.variantName} - ${variantPromo.name || "Promo"}`
                        : v.variantName
                    }
                  >
                    <div className={isVariantOutOfStock ? "grayscale" : ""}>
                      <Image
                        src={v.images[0].url}
                        alt={v.variantName}
                        width={48}
                        height={48}
                        className="object-cover mix-blend-multiply"
                      />
                    </div>
                    {/* Out of Stock indicator - diagonal line */}
                    {isVariantOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-error/70 rotate-45 transform origin-center" />
                      </div>
                    )}
                    {/* Promotion indicator badge */}
                    {variantPromo && !isVariantOutOfStock && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-surface flex items-center justify-center shadow-custom">
                        <span className="text-[7px] font-black text-dark">
                          %
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase text-muted">
                Select Size
              </h3>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-secondary underline"
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
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-muted">
                Qty
              </span>
              <div className="flex items-center border border-default rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-2 transition-colors disabled:text-muted disabled:cursor-not-allowed"
                >
                  <IoRemoveOutline size={18} />
                </button>
                <span className="w-10 text-center font-display font-black text-primary">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  disabled={
                    qty >= 10 || (!!selectedSize && qty >= availableStock)
                  }
                  className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-2 transition-colors disabled:text-muted disabled:cursor-not-allowed"
                >
                  <IoAddOutline size={18} />
                </button>
              </div>
              {selectedSize && availableStock > 0 && (
                <span className="text-[10px] text-muted font-bold uppercase">
                  {availableStock} available
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToBag}
                disabled={
                  !selectedSize || availableStock === 0 || isLimitReached
                }
                className="flex-1 py-5 bg-dark text-inverse rounded-full font-display font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-dark transition-all shadow-custom hover:shadow-hover active:scale-95 disabled:bg-surface-3 disabled:text-muted disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isLimitReached
                  ? "Inventory Maxed"
                  : availableStock === 0 && selectedSize
                  ? "Sold Out"
                  : "Add to Bag"}
              </button>

              {/* Wishlist Toggle */}
              <button
                onClick={handleToggleWishlist}
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                  isInWishlist
                    ? "bg-dark border-dark text-inverse"
                    : "bg-surface border-default text-primary hover:border-dark"
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
            <div className="flex items-center justify-center gap-2 p-3 bg-surface-2 rounded-xl">
              <span className="text-[10px] font-bold text-secondary uppercase">
                Or 3 Interest-Free payments of Rs. {(finalPrice / 3).toFixed(0)}{" "}
                with
              </span>
              <Image src={KOKOLogo} alt="Koko" width={35} height={12} />
            </div>
          </div>

          {/* Share & Help Section */}
          <div className="flex flex-col gap-4 border-t border-default pt-6">
            {/* Social Share Buttons */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted">
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
              className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-muted hover:text-success"
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
        price={finalPrice}
        selectedSize={selectedSize}
        canAddToBag={!!selectedSize && (sizeStock[selectedSize] ?? 0) > 0}
        onAddToBag={handleAddToBag}
        qty={qty}
        onQtyChange={setQty}
        maxQty={Math.min(10, availableStock || 10)}
      />
    </section>
  );
};

export default ProductHero;
