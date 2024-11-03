"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { CartItem, Item, Size, Variant } from "@/interfaces";
import { IoAdd, IoRemove } from "react-icons/io5";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { pushToCart } from "@/redux/cartSlice/cartSlice";
import {any} from "prop-types";

const ProductHero = ({ item }: { item: Item }) => {
    const [selectedImage, setSelectedImage] = useState(item.thumbnail);
    const [selectedVariant, setSelectedVariant] = useState<Variant>({
        variantId: "",
        variantName: "",
        images: [],
        sizes: [],
    });
    const [selectedSize, setSelectedSize] = useState<Size>({ size: "", stock: 0 });
    const [qty, setQty] = useState(0);
    const [outOfStocks, setOutOfStocks] = useState(false);
    const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");

    const dispatch: AppDispatch = useDispatch();

    const imageRef = useRef<HTMLDivElement>(null);
    const zoomRef = useRef<HTMLDivElement>(null);

    const setQuantity = (direction: string) => {
        if (direction === "in") {
            if (selectedSize.stock > qty) {
                setQty(qty + 1);
            } else {
                setQty(selectedSize.stock);
            }
        } else if (direction === "dec") {
            if (qty == 0) {
                setQty(0);
            } else {
                setQty(qty - 1);
            }
        }
    };

    const addToCart = async () => {
        const cartItem: CartItem = {
            itemId: item.itemId,
            variantId: selectedVariant.variantId,
            name: item.name,
            variantName: selectedVariant.variantName,
            thumbnail: selectedVariant.images[0].url,
            size: selectedSize.size,
            quantity: qty,
            type: item.type,
            price: item.sellingPrice,
        };

        dispatch(pushToCart(cartItem));
        reset();
    };

    const reset = () => {
        setSelectedVariant({ variantId: "", variantName: "", images: [], sizes: [] });
        setSelectedSize({ size: "", stock: 0 });
        setQty(0);
        setSelectedImage(item.thumbnail);
    };

    const checkOutOfStocks = () => {
        if (item.variants.length === 0) {
            setOutOfStocks(true);
            setOutOfStocksLabel("Coming Soon");
            return;
        }
        let iCount = 0;
        for (let i = 0; i < item.variants.length; i++) {
            let vCount = 0;
            for (let j = 0; j < item.variants[i].sizes.length; j++) {
                if (item.variants[i].sizes[j].stock == 0) {
                    vCount++;
                }
            }
            if (vCount === item.variants[i].sizes.length) {
                iCount++;
            }
        }

        if (iCount === item.variants.length) {
            setOutOfStocks(true);
        }
    };

    useEffect(() => {
        checkOutOfStocks();
    }, [item]);

    const handleZoom = (e: React.MouseEvent) => {
        if (!zoomRef.current || !imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = ((x / rect.width) * 100).toFixed(2);
        const yPercent = ((y / rect.height) * 100).toFixed(2);

        zoomRef.current.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        zoomRef.current.style.display = "block";
    };

    const removeZoom = () => {
        if (zoomRef.current) zoomRef.current.style.display = "none";
    };

    if (!item) return <div>Loading product...</div>;

    return (
        <section className="w-full relative">
            <h1 className="md:text-4xl text-2xl tracking-wider mt-10 text-gray-800 font-extrabold">
                {item.name || "Product"}
            </h1>
            <article className="grid md:grid-cols-2 grid-cols-1 lg:gap-20 gap-6 mt-10">
                <div className="flex flex-col gap-6 items-center">
                    {/* Main Image Container with Zoom Effect */}
                    <div
                        ref={imageRef}
                        onMouseMove={handleZoom}
                        onMouseLeave={removeZoom}
                        className="relative lg:h-[60vh] lg:w-[40vw] w-full bg-cover rounded-xl overflow-hidden"
                    >
                        <Image
                            src={selectedImage.url}
                            alt={item.name}
                            width={400}
                            height={500}
                            className="w-full h-full object-contain"
                        />
                        <div
                            ref={zoomRef}
                            className="absolute inset-0 bg-no-repeat bg-cover pointer-events-none"
                            style={{
                                backgroundImage: `url(${selectedImage.url})`,
                                display: "none",
                                backgroundSize: "200%", // Adjust zoom level here
                            }}
                        ></div>
                    </div>
                    <ul className="flex gap-3 mt-4">
                        {selectedVariant.images.map((image, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setSelectedImage(image)}
                                    className={`p-1 rounded-lg transition ${
                                        selectedImage === image ? "ring-2 ring-primary" : ""
                                    }`}
                                >
                                    <Image
                                        src={image.url}
                                        alt={item.name}
                                        width={70}
                                        height={70}
                                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Rest of the Product Details */}
                <div className="flex flex-col gap-4">
                    <p className="text-lg font-medium capitalize text-gray-600">{item.manufacturer}</p>
                    <h2 className="text-3xl font-extrabold text-gray-900">{item.name}</h2>
                    <div className="text-gray-900 flex items-center space-x-3">
                        <span className="text-2xl font-semibold text-red-500">{"Rs. " + item.sellingPrice}</span>
                        {item.discount > 0 && (
                            <span className="line-through text-lg text-gray-500">
                                {"Rs. " + (item.sellingPrice + (item.sellingPrice * item.discount) / 100).toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700">Available Colors</h3>
                        <ul className="flex gap-4 mt-2 flex-wrap">
                            {item.variants.map((variant, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => {
                                            setSelectedVariant(variant);
                                            setSelectedImage(variant.images[0]);
                                            setSelectedSize({ size: "", stock: 0 });
                                            setQty(0);
                                        }}
                                        className={`rounded-md p-2 text-sm capitalize ${
                                            selectedVariant.variantId === variant.variantId
                                                ? "bg-primary text-white"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        {variant.variantName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700">Available Sizes</h3>
                        {selectedSize && (
                            <p className="text-gray-600 text-sm">{`${selectedSize.stock} available`}</p>
                        )}
                        <ul className="flex gap-4 mt-2">
                            {selectedVariant.sizes.map((size, index) => (
                                <li key={index}>
                                    <button
                                        disabled={size.stock == 0}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setQty(0);
                                        }}
                                        className={`p-2 rounded-md ${
                                            size.size === selectedSize.size
                                                ? "bg-primary text-white"
                                                : "bg-gray-200"
                                        } ${size.stock == 0 && "opacity-50"}`}
                                    >
                                        {size.size}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700">Quantity</h3>
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => setQuantity("dec")}
                                disabled={qty == 0}
                                className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                            >
                                <IoRemove size={20} />
                            </button>
                            <span className="text-lg font-medium text-gray-800">{qty}</span>
                            <button
                                onClick={() => setQuantity("in")}
                                disabled={selectedSize.stock == 0}
                                className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                            >
                                <IoAdd size={20} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={addToCart}
                        disabled={qty == 0}
                        className={`w-full py-3 mt-6 rounded-lg text-lg font-semibold text-white transition ${
                            qty > 0 ? "bg-primary hover:bg-primary-dark" : "bg-gray-400"
                        }`}
                    >
                        Add to Cart
                    </button>
                </div>
            </article>
            {outOfStocks && (
                <div className="bg-white absolute inset-0 bg-opacity-75 flex justify-center items-center">
                    <h2
                        className={`text-white p-4 rounded-lg text-xl font-semibold ${
                            outOfStocksLabel === "Coming Soon" ? "bg-yellow-500" : "bg-red-500"
                        }`}
                    >
                        {outOfStocksLabel}
                    </h2>
                </div>
            )}
        </section>
    );
};

export default ProductHero;
