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
import { calculateFinalPrice } from "@/utils/pricing";
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

  // Use shared pricing utility
  const finalPrice = calculateFinalPrice(product, activePromo);

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
        <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative overflow-y-auto bg-white w-full max-w-6xl h-[92vh] md:h-auto md:max-h-[90vh] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[0_24px_54px_rgba(0,0,0,0.15)] overflow-hidden rounded-t-[2rem] md:rounded-none"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-50 p-2 bg-white/50 backdrop-blur-md md:bg-transparent rounded-full hover:bg-gray-100 transition-all"
            >
              <IoClose size={26} className="text-black" />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto no-scrollbar">
              {/* LEFT: VISUALS SECTION */}
              <div className="w-full md:w-1/2 flex flex-col bg-[#f6f6f6] shrink-0">
                <div className="relative aspect-square flex items-center justify-center p-6 md:p-12">
                  <Image
                    src={
                      selectedVariant?.images?.[0]?.url || product.thumbnail.url
                    }
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 md:hover:scale-105"
                    priority
                  />
                </div>

                {/* Variant Swatches */}
                {product.variants.length > 1 && (
                  <div className="px-6 pb-6 md:pb-10 flex gap-4 overflow-x-auto no-scrollbar justify-start md:justify-center">
                    {product.variants.map((v) => (
                      <button
                        key={v.variantId}
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedSize("");
                        }}
                        className={`relative w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white transition-all rounded-[4px] p-1 ${
                          selectedVariant?.variantId === v.variantId
                            ? "border-black border-[1.5px] scale-105 z-10 shadow-sm"
                            : "border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100"
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
              <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col bg-white">
                <div className="mb-6">
                  <p className="text-[#707072] text-[14px] md:text-[15px] font-normal capitalize mb-1">
                    {product.brand?.replace("-", " ")}
                  </p>
                  <h2 className="text-[20px] md:text-[24px] font-medium text-[#111] leading-tight tracking-tight">
                    {product.name}
                  </h2>
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <span
                    className={`text-[18px] md:text-[20px] font-medium ${
                      product.discount > 0 || activePromo
                        ? "text-[#b22222]"
                        : "text-black"
                    }`}
                  >
                    Rs. {finalPrice.toLocaleString()}
                  </span>
                  {(product.discount > 0 || activePromo) && (
                    <span className="text-[#707072] text-[15px] md:text-[16px] line-through decoration-[0.5px]">
                      Rs. {product.marketPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Size Grid */}
                <div className="mb-8">
                  <p className="text-[16px] font-medium mb-4 text-[#111]">
                    Select Size
                  </p>
                  <SizeGrid
                    sizes={selectedVariant?.sizes || []}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                    stockMap={sizeStock}
                    stockLoading={stockLoading}
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <span className="text-[14px] font-medium text-[#111]">
                      Quantity
                    </span>
                    <div className="flex items-center border border-gray-200 rounded-full px-3 py-1">
                      <button
                        onClick={() => setQty((p) => Math.max(1, p - 1))}
                        className="p-1 disabled:opacity-20"
                        disabled={qty <= 1}
                      >
                        <IoRemove size={16} />
                      </button>
                      <span className="w-8 text-center text-[14px] font-medium">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          setQty((p) =>
                            Math.min(availableStock - bagQty || 10, p + 1)
                          )
                        }
                        className="p-1 disabled:opacity-20"
                        disabled={qty >= availableStock - bagQty || qty >= 10}
                      >
                        <IoAdd size={16} />
                      </button>
                    </div>
                  </div>
                  {selectedSize && !stockLoading && (
                    <span
                      className={`text-[12px] font-medium uppercase tracking-tight ${
                        availableStock < 5 ? "text-[#b22222]" : "text-green-700"
                      }`}
                    >
                      {availableStock < 5
                        ? `Only ${availableStock} Left!`
                        : "In Stock"}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-3 pb-8 md:pb-0">
                  <button
                    onClick={handleAddToBag}
                    disabled={!selectedSize || isOutOfStock || isLimitReached}
                    className="w-full py-4 md:py-5 bg-black text-white rounded-full font-medium text-[15px] md:text-[16px] transition-all active:scale-[0.98] disabled:bg-[#f5f5f5] disabled:text-[#707072]"
                  >
                    {isOutOfStock
                      ? "Sold Out"
                      : isLimitReached
                      ? "Limit Reached"
                      : "Add to Bag"}
                  </button>
                  <Link
                    href={`/collections/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center justify-center w-full py-3 md:py-4 border border-gray-200 rounded-full font-medium text-[15px] md:text-[16px] hover:border-black transition-all"
                  >
                    View Product Details
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
