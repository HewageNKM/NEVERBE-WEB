"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { CartItem, Item, Size, Variant } from "@/interfaces";
import { IoAdd, IoCartOutline, IoRemove } from "react-icons/io5";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { pushToCart } from "@/redux/cartSlice/cartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sizeData } from "@/constants";
import { KOKOLogo } from "@/assets/images";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const ProductHero = ({ item }: { item: Item }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authSlice);

  const [selectedImage, setSelectedImage] = useState(item.thumbnail);
  const [selectedVariant, setSelectedVariant] = useState<Variant>({
    variantId: "",
    variantName: "",
    images: [],
    sizes: [],
  });
  const [selectedSize, setSelectedSize] = useState<Size>({ size: "", stock: 0 });
  const [qty, setQty] = useState(0);
  const [otherSizes, setOtherSizes] = useState({ uk: "", us: "", cm: "" });
  const [outOfStocks, setOutOfStocks] = useState(false);
  const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const imageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item.variants?.length) return;
    const defaultVariant = item.variants[0];
    setSelectedVariant(defaultVariant);
    setSelectedImage(defaultVariant.images[0] || item.thumbnail);
    const defaultSize = defaultVariant.sizes.find((s) => s.stock > 0) || {
      size: "",
      stock: 0,
    };
    setSelectedSize(defaultSize);
    if (defaultSize.size) calculateSizes(defaultSize.size);
  }, [item]);

  useEffect(() => {
    if (item) checkOutOfStock();
  }, [item]);

  const checkOutOfStock = () => {
    if (!item?.variants?.length) {
      setOutOfStocks(true);
      return;
    }
    const allSizes = item.variants.flatMap((v) => v.sizes || []);
    if (!allSizes.length) {
      setOutOfStocks(true);
      return;
    }
    const totalStock = allSizes.reduce((acc, s) => acc + (s.stock || 0), 0);
    if (totalStock <= 0) {
      setOutOfStocks(true);
      setOutOfStocksLabel("Out of Stock");
      return;
    }
    const allZero = allSizes.every((s) => s.stock === 0);
    if (allZero) {
      setOutOfStocks(true);
      setOutOfStocksLabel("Coming Soon");
    } else {
      setOutOfStocks(false);
    }
  };

  const setQuantity = (dir: "inc" | "dec") => {
    if (dir === "inc") setQty(Math.min(qty + 1, selectedSize.stock));
    else setQty(Math.max(qty - 1, 0));
  };

  const addToCart = () => {
    if (qty === 0 || !selectedSize.size) return;
    const cartItem: CartItem = {
      bPrice: item.buyingPrice,
      discount:
        Math.round((item.sellingPrice * (item.discount / 100)) / 10) * 10 * qty,
      itemId: item.itemId,
      variantId: selectedVariant.variantId,
      name: item.name,
      variantName: selectedVariant.variantName,
      thumbnail: selectedVariant.images[0]?.url || item.thumbnail.url,
      size: selectedSize.size,
      quantity: qty,
      type: item.type,
      price: item.sellingPrice,
    };
    dispatch(pushToCart(cartItem));
    resetSelection();
  };

  const buyNow = async () => {
    await addToCart();
    router.push("/checkout");
  };

  const resetSelection = () => {
    setSelectedVariant({ variantId: "", variantName: "", images: [], sizes: [] });
    setSelectedSize({ size: "", stock: 0 });
    setQty(0);
    setSelectedImage(item.thumbnail);
  };

  const calculateSizes = (euSize: string) => {
    const size = sizeData.find((s) => s["EU"] === euSize);
    if (size)
      setOtherSizes({
        uk: size["UK"],
        us: size["US - Women's"] || size["US - Men's"] || size["US - Kids"],
        cm: size["CM"],
      });
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

      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            ref={imageRef}
            className="relative w-full rounded-xl overflow-hidden shadow-md cursor-zoom-in"
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
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
            {outOfStocks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-md shadow"
              >
                {outOfStocksLabel}
              </motion.div>
            )}
          </div>

          {/* Variant Thumbnails */}
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

        {/* Right: Details */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-500 font-medium capitalize">{item.manufacturer}</p>
          <h1 className="text-2xl font-display md:text-3xl font-extrabold text-gray-900">
            {item.name}
          </h1>

          {/* Pricing */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <p className="text-gray-400 line-through text-sm">
                Rs. {item.marketPrice.toFixed(2)}
              </p>
              <motion.p
                className="text-gray-900 font-bold text-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Rs.{" "}
                {(item.discount > 0
                  ? Math.round(
                      (item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10
                    ) * 10
                  : item.sellingPrice
                ).toFixed(2)}
              </motion.p>
            </div>

            {/* KOKO payment info */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <p>
                or 3x Rs.
                {(item.discount > 0
                  ? Math.round(
                      (item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10
                    ) * 10
                  : item.sellingPrice / 3
                ).toFixed(2)}{" "}
                with
              </p>
              <Image src={KOKOLogo} alt="KOKO logo" width={25} height={25} />
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className="font-medium font-display text-gray-700 mb-1">Colors</h3>
            <div className="flex gap-2 flex-wrap">
              {item.variants.map((v, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setSelectedVariant(v);
                    setSelectedImage(v.images[0]);
                    setSelectedSize({ size: "", stock: 0 });
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
              {selectedVariant.sizes.map((s, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: s.stock > 0 ? 1.1 : 1 }}
                  onClick={() => {
                    setSelectedSize(s);
                    setQty(0);
                    calculateSizes(s.size);
                  }}
                  disabled={s.stock <= 0}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedSize.size === s.size
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  } ${s.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {s.size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center mt-4">
            <div className="flex items-center gap-2 w-fit border rounded-md p-1">
              <button onClick={() => setQuantity("dec")} className="p-2 text-gray-700">
                <IoRemove />
              </button>
              <span className="px-4">{qty}</span>
              <button onClick={() => setQuantity("inc")} className="p-2 text-gray-700">
                <IoAdd />
              </button>
            </div>

            <motion.button
              onClick={addToCart}
              disabled={qty === 0}
              whileHover={{ scale: qty === 0 ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center w-fit gap-2 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
            >
              <IoCartOutline /> Add to Cart
            </motion.button>

            <motion.button
              onClick={buyNow}
              disabled={qty === 0}
              whileHover={{ scale: qty === 0 ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border w-fit border-primary rounded-md text-primary disabled:opacity-50"
            >
              Buy Now
            </motion.button>

            <motion.a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hello, I would like to inquire about the product:\nProduct: ${item.name}\nVariant: ${selectedVariant.variantName || "N/A"}\nSize: ${selectedSize.size || "N/A"}`
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
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-display md:text-2xl font-bold text-gray-800">
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
