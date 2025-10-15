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

const ProductHero = ({ item }: { item: Item }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authSlice);

  // Add this inside your component, after all useState declarations
  useEffect(() => {
    if (!item.variants?.length) return;

    // Default Variant
    const defaultVariant = item.variants[0];
    setSelectedVariant(defaultVariant);

    // Default Image
    setSelectedImage(defaultVariant.images[0] || item.thumbnail);

    // Default Size (first size with stock > 0)
    const defaultSize = defaultVariant.sizes.find((s) => s.stock > 0) || {
      size: "",
      stock: 0,
    };
    setSelectedSize(defaultSize);

    // Update size conversion display
    if (defaultSize.size) calculateSizes(defaultSize.size);
  }, [item]);

  const [selectedImage, setSelectedImage] = useState(item.thumbnail);
  const [selectedVariant, setSelectedVariant] = useState<Variant>({
    variantId: "",
    variantName: "",
    images: [],
    sizes: [],
  });
  const [selectedSize, setSelectedSize] = useState<Size>({
    size: "",
    stock: 0,
  });
  const [qty, setQty] = useState(0);
  const [otherSizes, setOtherSizes] = useState({ uk: "", us: "", cm: "" });
  const [outOfStocks, setOutOfStocks] = useState(false);
  const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const imageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item) {
      checkOutOfStock();
    }
  }, [item]);

  const checkOutOfStock = () => {
    if (!item?.variants?.length) {
      setOutOfStocks(true);
      setOutOfStocksLabel("Out of Stock");
      return;
    }

    // Flatten all sizes across variants
    const allSizes = item.variants.flatMap((v) => v.sizes || []);

    if (!allSizes.length) {
      setOutOfStocks(true);
      setOutOfStocksLabel("Out of Stock");
      return;
    }

    const totalStock = allSizes.reduce((acc, s) => acc + (s.stock || 0), 0);

    if (totalStock <= 0) {
      // Out of stock everywhere
      setOutOfStocks(true);
      setOutOfStocksLabel("Out of Stock");
      return;
    }

    // Optional: detect "coming soon" variants (sizes defined but zero stock)
    const allZero = allSizes.every((s) => s.stock === 0);
    const someZero = allSizes.some((s) => s.stock === 0);

    if (allZero) {
      setOutOfStocks(true);
      setOutOfStocksLabel("Coming Soon");
    } else {
      setOutOfStocks(false);
    }
  };

  // Quantity handler
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
    setSelectedVariant({
      variantId: "",
      variantName: "",
      images: [],
      sizes: [],
    });
    setSelectedSize({ size: "", stock: 0 });
    setQty(0);
    setSelectedImage(item.thumbnail);
  };

  const handleZoom = (e: React.MouseEvent) => {
    if (!zoomRef.current || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
    zoomRef.current.style.display = "block";
  };

  const removeZoom = () => {
    if (zoomRef.current) zoomRef.current.style.display = "none";
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
    <section className="w-full flex flex-col md:mt-5 gap-4 md:gap-6 lg:gap-5">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-gray-600 text-sm">
        <Link href="/collections/products" className="hover:underline">
          Products
        </Link>
        <span>/</span>
        <span className="font-medium">{item.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          <div
            ref={imageRef}
            onMouseMove={handleZoom}
            onMouseLeave={removeZoom}
            className="relative w-full rounded-xl overflow-hidden shadow-md cursor-zoom-in"
          >
            <Image
              src={selectedImage.url}
              alt={item.name}
              width={600}
              height={600}
              className="w-full h-full object-contain"
            />
            <div
              ref={zoomRef}
              className="absolute inset-0 bg-no-repeat bg-cover pointer-events-none hidden"
              style={{
                backgroundImage: `url(${selectedImage.url})`,
                backgroundSize: "200%",
              }}
            />
            {/* Inside the image container */}
            {outOfStocks && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-md shadow">
                {outOfStocksLabel}
              </div>
            )}
          </div>
          {/* Variant Thumbnails */}
          <ul className="flex gap-3 p-2 overflow-x-auto hide-scrollbar">
            {selectedVariant.images.map((img, idx) => (
              <li key={idx}>
                <button
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
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-4">
          <p className="text-gray-500 font-medium capitalize">
            {item.manufacturer}
          </p>
          <h1 className="text-2xl font-display md:text-3xl font-extrabold text-gray-900">
            {item.name}
          </h1>

          {/* Pricing like ItemCard */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <p className="text-gray-400 line-through text-sm">
                Rs. {item.marketPrice.toFixed(2)}
              </p>
              <p className="text-gray-900 font-bold text-lg">
                Rs.{" "}
                {(item.discount > 0
                  ? Math.round(
                      (item.sellingPrice -
                        (item.sellingPrice * item.discount) / 100) /
                        10
                    ) * 10
                  : item.sellingPrice
                ).toFixed(2)}
              </p>
            </div>
            {/* Inside Right Details Section, just below the pricing */}
            {outOfStocks && (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-white text-sm font-medium w-fit mt-2 ${
                  outOfStocksLabel === "Coming Soon"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                <span>{outOfStocksLabel}</span>
              </div>
            )}

            {/* KOKO payment info */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <p>
                or 3x Rs.
                {(item.discount > 0
                  ? Math.round(
                      (item.sellingPrice -
                        (item.sellingPrice * item.discount) / 100) /
                        10
                    ) * 10
                  : item.sellingPrice / 3
                ).toFixed(2)}{" "}
                with
              </p>
              <Image
                src={KOKOLogo}
                alt="KOKO logo"
                width={25}
                height={25}
                className="inline-block"
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <h3 className="font-medium font-display text-gray-700 mb-1">
              Colors
            </h3>
            <div className="flex gap-2 flex-wrap">
              {item.variants.map((v, i) => (
                <button
                  key={i}
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
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Sizes</h3>
            <div className="flex gap-2 flex-wrap">
              {selectedVariant.sizes.map((s, idx) => (
                <button
                  key={idx}
                  disabled={s.stock <= 0}
                  onClick={() => {
                    setSelectedSize(s);
                    setQty(0);
                    calculateSizes(s.size);
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedSize.size === s.size
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  } ${s.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSize.size && (
              <div className="text-gray-500 text-sm mt-2 flex gap-3">
                <span>UK: {otherSizes.uk || "N/A"}</span>
                <span>US: {otherSizes.us || "N/A"}</span>
                <span>CM: {otherSizes.cm || "N/A"}</span>
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center mt-4">
            <div className="flex items-center gap-2 w-fit border rounded-md p-1">
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
            <div className="flex gap-2">
              <button
                onClick={addToCart}
                disabled={qty === 0}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
              >
                <IoCartOutline /> Add to Cart
              </button>
              <button
                onClick={buyNow}
                disabled={qty === 0}
                className="px-4 py-2 border border-primary rounded-md text-primary disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
            <div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hello, I would like to inquire about the product:\n` +
                    `Product: ${item.name}\n` +
                    `Variant: ${selectedVariant.variantName || "N/A"}\n` +
                    `Size: ${selectedSize.size || "N/A"}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                <FaWhatsapp size={20} />
                Inquire
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-display md:text-2xl font-bold text-gray-800">
          Description
        </h2>
        <p className="text-gray-600 mt-2">
          {item.description || "No description available."}
        </p>
      </div>
    </section>
  );
};

export default ProductHero;
