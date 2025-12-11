"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { IoAdd, IoCartOutline, IoRemove } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AppDispatch } from "@/redux/store";
import { pushToCart } from "@/redux/cartSlice/cartSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { KOKOLogo } from "@/assets/images";

const ProductHero = ({ item }: { item: Product }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

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
  const [qty, setQty] = useState(0);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [outOfStocks, setOutOfStocks] = useState(false);
  const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const [stockLoading, setStockLoading] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item.variants?.length) {
      const defaultVariant = item.variants[0];
      const defaultSize = defaultVariant.sizes?.[0] || "";

      setSelectedVariant(defaultVariant);
      setSelectedImage(defaultVariant.images[0] || item.thumbnail);
      setSelectedSize(defaultSize);

      // 🔹 Automatically fetch stock for the default size
      if (defaultSize && item.id) {
        getAvailableStockFor(defaultSize);
      }
    }
  }, [item]);

  // 🔹 Fetch stock when variant or size changes
  useEffect(() => {
    if (selectedVariant && selectedSize && item.id) {
      getAvailableStockFor(selectedSize);
    }
  }, [selectedVariant, selectedSize]);

  // 🔹 Fetch stock quantity from API
  const getAvailableStockFor = async (size: string) => {
    try {
      setStockLoading(true);
      const res = await fetch(
        `/api/v1/inventory?productId=${item.id}&variantId=${selectedVariant.variantId}&size=${size}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setAvailableStock(data.quantity || 0);
    } catch (error) {
      console.error("Error fetching stock:", error);
      setAvailableStock(0);
    } finally {
      setStockLoading(false);
    }
  };

  useEffect(() => {
    if (availableStock <= 0) {
      setOutOfStocks(true);
      setOutOfStocksLabel("Out of Stock");
    } else {
      setOutOfStocks(false);
    }
  }, [availableStock]);

  // 🔹 Quantity adjustment
  const setQuantity = (dir: "inc" | "dec") => {
    if (dir === "inc" && qty < availableStock) setQty(qty + 1);
    else if (dir === "dec" && qty > 0) setQty(qty - 1);
  };

  // 🔹 Add to cart
  const addToCart = () => {
    if (qty === 0 || !selectedSize) return;
    const cartItem = {
      bPrice: item.buyingPrice,
      discount:
        Math.round((item.sellingPrice * (item.discount / 100)) / 10) * 10 * qty,
      itemId: item.id,
      variantId: selectedVariant.variantId,
      name: item.name,
      variantName: selectedVariant.variantName,
      thumbnail: selectedVariant.images[0]?.url || item.thumbnail.url,
      size: selectedSize,
      quantity: qty,
      category: item.category,
      price: item.sellingPrice,
    };
    dispatch(pushToCart(cartItem));
    resetSelection();
  };

  // 🔹 Buy Now
  const buyNow = async () => {
    addToCart();
    router.push("/checkout");
  };

  // 🔹 Reset after adding to cart
  const resetSelection = () => {
    setSelectedSize("");
    setQty(0);
  };

  return (
    <motion.section
      className="w-full flex flex-col md:mt-5 gap-4 md:gap-6 lg:gap-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Breadcrumb */}
      <motion.div
        className="flex gap-2 text-gray-600 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/collections/products" className="hover:underline">
          Products
        </Link>
        <span>/</span>
        <span className="font-medium">{item.name}</span>
      </motion.div>

      {/* Product section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left — Images */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            ref={imageRef}
            className="relative w-full rounded-xl overflow-hidden shadow-md"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage.url}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={selectedImage.url}
                  alt={item.name}
                  width={600}
                  height={600}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Variant thumbnails */}
          <div className="flex gap-3 p-2 overflow-x-auto hide-scrollbar">
            {selectedVariant.images.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(img)}
                className={`p-1 rounded-lg transition ring-2 ${
                  selectedImage === img ? "ring-primary" : "ring-transparent"
                }`}
              >
                <Image
                  src={img.url}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right — Product Details */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-500 font-medium capitalize">{item.brand}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {item.name}
          </h1>

          {/* Pricing */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <p className="text-gray-400 line-through text-sm">
                Rs. {item.marketPrice.toFixed(2)}
              </p>
              <p className="text-gray-900 font-bold text-lg">
                Rs.{" "}
                {(
                  Math.round(
                    (item.discount > 0
                      ? item.sellingPrice -
                        (item.sellingPrice * item.discount) / 100
                      : item.sellingPrice) / 10
                  ) * 10
                ).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <p>
                or 3 x Rs.
                {(
                  (item.sellingPrice -
                    (item.sellingPrice * item.discount) / 100) /
                  3
                ).toFixed(2)}{" "}
                with
              </p>
              <Image src={KOKOLogo} alt="KOKO" width={25} height={25} />
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Colors</h3>
            <div className="flex gap-2 flex-wrap">
              {item.variants.map((v, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setSelectedVariant(v);
                    setSelectedImage(v.images[0]);
                    setSelectedSize("");
                    setQty(0);
                  }}
                  className={`px-3 py-1 rounded-md text-sm capitalize ${
                    selectedVariant.variantId === v.variantId
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {v.variantName}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Sizes</h3>
            <div className="flex gap-2 flex-wrap">
              {selectedVariant.sizes.map((size, idx) => (
                <motion.button
                  key={idx}
                  disabled={stockLoading}
                  whileHover={{ scale: stockLoading ? 1 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedSize(size);
                    getAvailableStockFor(size);
                  }}
                  className={`relative flex items-center justify-center min-w-[45px] px-3 py-1 rounded-md text-sm border transition-all duration-150 ${
                    selectedSize === size
                      ? "bg-primary text-white border-primary"
                      : "bg-gray-100 border-gray-300 text-gray-700"
                  } ${
                    stockLoading && selectedSize === size ? "opacity-70" : ""
                  }`}
                >
                  {stockLoading && selectedSize === size ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    size
                  )}
                </motion.button>
              ))}
            </div>

            {/* Stock Info */}
            {selectedSize && !stockLoading && (
              <p
                className={`text-sm font-bold font-display mt-3 ${
                  availableStock > 0 ? "text-primary" : "text-red-500"
                }`}
              >
                {availableStock > 0
                  ? `In Stock: ${availableStock}`
                  : "Out of Stock"}
              </p>
            )}
          </div>

          {/* Quantity & Buttons */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center mt-1">
            <div className="flex items-center gap-2 w-fit border border-gray-200 rounded-md p-1">
              <button
                onClick={() => setQuantity("dec")}
                className="p-2 text-gray-700"
              >
                <IoRemove />
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() => setQuantity("inc")}
                className="p-2 text-gray-700"
              >
                <IoAdd />
              </button>
            </div>

            <motion.button
              onClick={addToCart}
              disabled={qty === 0 || outOfStocks}
              whileHover={{ scale: qty === 0 ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center w-fit gap-2 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
            >
              <IoCartOutline /> Add to Cart
            </motion.button>

            <motion.button
              onClick={buyNow}
              disabled={qty === 0 || outOfStocks}
              whileHover={{ scale: qty === 0 ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border w-fit border-primary rounded-md text-primary disabled:opacity-50"
            >
              Buy Now
            </motion.button>

            <motion.a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hello, I would like to inquire about the product:\nProduct: ${
                  item.name
                }\nVariant: ${selectedVariant.variantName || "N/A"}\nSize: ${
                  selectedSize || "N/A"
                }`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex w-fit items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              <FaWhatsapp size={20} />
              Inquire
            </motion.a>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-left max-w-2xl mx-auto">
            *This product is a premium inspired version (Master Copy/7A). NOT an
            original branded item.
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Description
        </h2>
        <p className="text-gray-600 mt-2">
          {item.description || "No description available."}
        </p>
      </motion.div>
    </motion.section>
  );
};

export default ProductHero;
