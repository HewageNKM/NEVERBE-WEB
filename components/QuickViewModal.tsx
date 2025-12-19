"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoAdd, IoRemove } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";
import { addToBag } from "@/redux/bagSlice/bagSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { usePromotionsContext } from "@/components/PromotionsProvider";

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

  // Reset on product change
  useEffect(() => {
    if (product) {
      const defaultVariant = product.variants?.[0] || null;
      setSelectedVariant(defaultVariant);
      setSelectedSize("");
      setQty(1);
      setSizeStock({});
    }
  }, [product]);

  // Preload stock for variant
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

  // Price calculation
  let finalPrice = product.sellingPrice;
  if (product.discount > 0) {
    finalPrice =
      Math.round(
        (product.sellingPrice -
          (product.sellingPrice * product.discount) / 100) /
          10
      ) * 10;
  }
  if (activePromo?.type === "PERCENTAGE" && activePromo.actions?.[0]?.value) {
    finalPrice =
      Math.round(
        (finalPrice * (100 - activePromo.actions[0].value)) / 100 / 10
      ) * 10;
  }

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
        price: product.sellingPrice,
        bPrice: 0,
        name: product.name,
        thumbnail: selectedVariant.images[0]?.url || product.thumbnail.url,
        discount:
          Math.round((product.sellingPrice * (product.discount / 100)) / 10) *
          10 *
          qty,
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <IoClose size={24} />
            </button>

            <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
              {/* Left: Image */}
              <div className="md:w-1/2 relative">
                <div className="aspect-square bg-[#f6f6f6] relative">
                  <Image
                    src={
                      selectedVariant?.images?.[0]?.url || product.thumbnail.url
                    }
                    alt={product.name}
                    fill
                    className="object-cover mix-blend-multiply"
                  />
                  {product.discount > 0 && (
                    <span className="absolute top-4 left-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-md shadow">
                      -{product.discount}%
                    </span>
                  )}
                  {activePromo && (
                    <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                      {activePromo.type === "BOGO" ? "BOGO" : "Promo"}
                    </span>
                  )}
                </div>

                {/* Variant Thumbnails */}
                {product.variants.length > 1 && (
                  <div className="flex gap-2 p-4 bg-gray-50">
                    {product.variants.map((v) => (
                      <button
                        key={v.variantId}
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedSize("");
                        }}
                        className={`w-14 h-14 bg-white rounded-lg overflow-hidden border-2 transition-all ${
                          selectedVariant?.variantId === v.variantId
                            ? "border-black"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={v.images[0]?.url || ""}
                          alt={v.variantName}
                          width={56}
                          height={56}
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="md:w-1/2 p-6 flex flex-col gap-4">
                {/* Header */}
                <div>
                  <p className="text-gray-500 text-sm capitalize">
                    {product.brand?.replace("-", " ")}
                  </p>
                  <h2 className="text-2xl font-black uppercase tracking-tight">
                    {product.name}
                  </h2>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-2xl font-bold ${
                      product.discount > 0 || activePromo
                        ? "text-red-600"
                        : "text-black"
                    }`}
                  >
                    Rs. {finalPrice.toLocaleString()}
                  </span>
                  {(product.discount > 0 || activePromo) && (
                    <span className="text-gray-400 line-through">
                      Rs. {product.marketPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Color/Variant */}
                {selectedVariant && (
                  <p className="text-sm text-gray-600">
                    Color:{" "}
                    <span className="font-medium">
                      {selectedVariant.variantName}
                    </span>
                  </p>
                )}

                {/* Size Selection */}
                <div>
                  <p className="text-sm font-bold uppercase mb-2">
                    Select Size
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedVariant?.sizes.map((size) => {
                      const stockQty = sizeStock[size];
                      const isOOS = stockQty !== undefined && stockQty <= 0;
                      const isLoading = stockLoading && stockQty === undefined;

                      return (
                        <button
                          key={size}
                          onClick={() => !isOOS && setSelectedSize(size)}
                          disabled={isOOS || isLoading}
                          className={`py-2.5 rounded-md text-sm font-bold border transition-all relative ${
                            selectedSize === size
                              ? "border-black bg-black text-white"
                              : isOOS
                              ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                              : "border-gray-200 text-black hover:border-black"
                          }`}
                        >
                          {isLoading ? "..." : size}
                          {isOOS && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedSize && (
                    <p className="text-red-500 text-xs mt-2">
                      * Please select a size
                    </p>
                  )}
                </div>

                {/* Stock Status */}
                {selectedSize && !stockLoading && (
                  <div className="text-xs font-bold uppercase">
                    {availableStock > 0 ? (
                      <span
                        className={
                          availableStock < 5 ? "text-red-600" : "text-green-600"
                        }
                      >
                        {availableStock < 5
                          ? `Only ${availableStock} Left!`
                          : `${availableStock} In Stock`}
                      </span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase">Qty</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty((p) => Math.max(1, p - 1))}
                      disabled={qty <= 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:border-black disabled:opacity-40"
                    >
                      <IoRemove size={14} />
                    </button>
                    <span className="w-8 text-center font-bold">{qty}</span>
                    <button
                      onClick={() =>
                        setQty((p) =>
                          Math.min(availableStock - bagQty || 10, p + 1)
                        )
                      }
                      disabled={qty >= availableStock - bagQty || qty >= 10}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:border-black disabled:opacity-40"
                    >
                      <IoAdd size={14} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 space-y-3">
                  <button
                    onClick={handleAddToBag}
                    disabled={!selectedSize || isOutOfStock || isLimitReached}
                    className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    {isLimitReached
                      ? "Limit Reached"
                      : isOutOfStock
                      ? "Out of Stock"
                      : "Add to Bag"}
                  </button>
                  <Link
                    href={`/collections/products/${product.id}`}
                    onClick={onClose}
                    className="block w-full py-3 text-center border border-gray-300 text-sm font-bold uppercase tracking-wide hover:border-black transition-all"
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
