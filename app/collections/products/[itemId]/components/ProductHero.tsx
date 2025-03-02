"use client";
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {CartItem, Item, Size, Variant} from "@/interfaces";
import {IoAdd, IoCartOutline, IoRemove} from "react-icons/io5";
import {AppDispatch, RootState} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import {pushToCart} from "@/redux/cartSlice/cartSlice";
import Link from "next/link";
import {getAllReviewsById} from "@/actions/itemDetailsAction";
import ReactStars from "react-stars";
import {useRouter} from "next/navigation";
import {sizeData} from "@/constants";

const ProductHero = ({item}: { item: Item }) => {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(item.thumbnail);
    const [selectedVariant, setSelectedVariant] = useState<Variant>({
        variantId: "",
        variantName: "",
        images: [],
        sizes: [],
    });
    const [selectedSize, setSelectedSize] = useState<Size>({size: "", stock: 0});
    const [qty, setQty] = useState(0);
    const [outOfStocks, setOutOfStocks] = useState(false);
    const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");
    const [totalRating, setTotalRating] = useState(0)
    const {user} = useSelector((state: RootState) => state.authSlice);
    const [otherSizes, setOtherSizes] = useState({ukSize: "", usSize: "", cmSize: ""});

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
        const price = Math.round((item.sellingPrice - (item.discount * item.sellingPrice / 100)) / 10) * 10;
        const discount = item.sellingPrice-(item.sellingPrice * item.discount / 100) * qty;
        const cartItem: CartItem = {
            discount: discount,
            itemId: item.itemId,
            variantId: selectedVariant.variantId,
            name: item.name,
            variantName: selectedVariant.variantName,
            thumbnail: selectedVariant.images[0].url,
            size: selectedSize.size,
            quantity: qty,
            type: item.type,
            price: price,
        };

        dispatch(pushToCart(cartItem));
        reset();
    };

    const buyNow = async () => {
        await addToCart()
        router.push("/checkout")
    }

    const reset = () => {
        setSelectedVariant({variantId: "", variantName: "", images: [], sizes: []});
        setSelectedSize({size: "", stock: 0});
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
        if (user) {
            checkOutOfStocks();
            getRating()
        }
    }, [item, user]);

    const getRating = async () => {
        try {
            const {totalRating} = await getAllReviewsById(item.itemId);
            setTotalRating(totalRating)
        } catch (e) {
            console.log(e)
        }
    }

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

    // Function to calculate sizes based on EU size
    const calculateSizes = (euSize) => {
        const size = sizeData.find(row => row["EU"] === euSize);
        if (size) {
            setOtherSizes({
                uk: size["UK"],
                us: size["US - Women's"] || size["US - Men's"] || size["US - Kids"],
                cm: size["CM"],
            })
        }
        return {};
    };

    return (
        <section className="w-full relative flex-content flex-col">
            <div>
                <div
                    className="md:text-2xl flex flex-row gap-1 text-xl tracking-wider mt-10 text-gray-800 font-extrabold">
                <span className="hover:border-b-2 border-gray-800 h-7">
                    <Link href={"/collections/products"}>
                          Products
                    </Link>
                </span>
                    <span>/</span>
                    <span>
                    {item.name}
                </span>
                </div>

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
                        <h2 className="text-xl font-extrabold text-gray-900">{item.name}</h2>
                        <Link href={"#rating"} className="flex flex-row gap-1 items-center font-bold">
                            <ReactStars edit={false}
                                        value={totalRating} count={5}
                                        size={25} color2={'#ffd700'}/>
                            <span>
                                ({totalRating})
                            </span>
                        </Link>
                        <div className="text-gray-900 flex items-center space-x-3">
                            <span className="text-lg font-semibold text-red-500">{"Rs. " + item.sellingPrice.toFixed(2)}</span>
                                <span className="line-through text-lg text-gray-500">
                                {"Rs. " + (item.marketPrice).toFixed(2)}
                            </span>
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
                                                setSelectedSize({size: "", stock: 0});
                                                setQty(0);
                                            }}
                         Make footer image static                   className={`rounded-md p-2 text-sm capitalize ${
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
                                                calculateSizes(size.size);
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
                            {
                                // show UK, US and cm sizes converting EU sizes
                                selectedSize.size && (
                                    <div className="mt-2">
                                        <ul className="flex gap-4 mt-2">
                                            {
                                                Object.keys(otherSizes).map((key, index) => (
                                                    <li key={index}>
                                                        <span className="text-gray-600 text-sm font-medium">
                                                            {key.toUpperCase()}: {otherSizes[key]}
                                                        </span>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )
                            }
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-700">Quantity</h3>
                            <div className="flex flex-row flex-wrap items-center md:justify-start justify-center gap-10">
                                {/* Quantity Adjustment Section */}
                                <div className="flex items-center gap-4 mt-2">
                                    {/* Decrease Button */}
                                    <button
                                        onClick={() => setQuantity("dec")}
                                        disabled={qty === 0}
                                        className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Decrease quantity"
                                    >
                                        <IoRemove size={20}/>
                                    </button>

                                    {/* Quantity Display */}
                                    <span className="text-lg font-medium text-gray-800">{qty}</span>

                                    {/* Increase Button */}
                                    <button
                                        onClick={() => setQuantity("in")}
                                        disabled={selectedSize.stock === 0}
                                        className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Increase quantity"
                                    >
                                        <IoAdd size={20}/>
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <div className="flex flex-row items-center flex-wrap gap-10">
                                    <button
                                        onClick={addToCart}
                                        disabled={qty === 0}
                                        className={`w-fit rounded-lg text-xl font-bold text-gray-700 hover:text-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed`}
                                        aria-label="Add to cart"
                                    >
                                        <IoCartOutline size={30} />
                                    </button>

                                    {/* Buy Now Button */}
                                    <button
                                        onClick={buyNow}
                                        disabled={qty === 0}
                                        className="rounded-lg text-xl font-semibold disabled:cursor-not-allowed disabled:opacity-60 text-primary-100 hover:text-primary-200 transition"
                                        aria-label="Buy now"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
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
            </div>
            <div className="pt-10">
                <h2 className="text-xl md:text-2xl font-bold tracking-wide text-gray-800">
                    Description
                </h2>
                <p className="pt-5 text-lg text-slate-600 text-left">
                    {item.description || "No description available!"}
                </p>
            </div>
        </section>
    );
};

export default ProductHero;
