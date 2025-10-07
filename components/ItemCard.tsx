"use client";
import React, {useEffect, useState} from 'react';
import {Item} from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {getAllReviewsById} from "@/actions/itemDetailsAction";
import ReactStars from "react-stars";

const ItemCard = ({item}: { item: Item }) => {
    const [outOfStocks, setOutOfStocks] = useState(false);
    const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");
    const {user} = useSelector((state: RootState) => state.authSlice);

    const checkOutOfStocks = () => {
        if (item.variants.length === 0) {
            setOutOfStocks(true);
            setOutOfStocksLabel("Coming Soon");
            return;
        }
        const allOutOfStock = item.variants.every(variant =>
            variant.sizes.every(size => size.stock === 0)
        );
        setOutOfStocks(allOutOfStock);
    };
    useEffect(() => {
        if (user) {
            checkOutOfStocks();
        }
    }, [item, user]);
    const findRangeOfSizes = () => {
        // Find min and max sizes from the sizes array of every variant
        const sizes = item.variants.map(variant => variant.sizes.map(size => size.size));
        if (sizes.length === 0) return "N/A";
        const allSizes = sizes.flat();
        const min = Math.min(...allSizes);
        const max = Math.max(...allSizes);
        return `${min} - ${max}`;
    }
    return (
        <article
            className="relative w-[8rem] md:w-[13rem]  h-auto max-w-xs transition-transform duration-300 transform lg:hover:scale-105 hover:shadow-lg hover:rounded-md overflow-hidden">
            <Link href={`/collections/products/${item.itemId.toLowerCase()}`}
                  aria-label={`View details for ${item.name}`}>
                <figure className="relative overflow-hidden">
                    <Image
                        width={300}
                        height={300}
                        src={item.thumbnail.url}
                        alt={item.name}
                        className="w-full h-[150px] sm:h-[200px] object-cover transition-transform duration-300 hover:scale-110"
                        priority // Load this image with high priority for better performance
                    />
                </figure>
                <header className="p-4 flex flex-col gap-1">
                    <h2 className="font-bold text-sm md:text-lg">{item.name}</h2>
                    <div className="flex flex-row items-center flex-wrap gap-1">
                        <p className={`text-red-500 text-sm font-bold ${item.discount > 0 && "line-through"}`}>Rs. {(Math.round(item.sellingPrice).toFixed(2))}</p>
                        <p className="line-through font-bold text-gray-500 text-sm">
                            Rs. {(item.marketPrice).toFixed(2)}
                        </p>
                    </div>
                    {item.discount > 0 && (
                        <p className="text-sm font-bold text-yellow-500">
                            Rs. {(Math.round((item.sellingPrice - (item.sellingPrice * item.discount / 100)) / 10) * 10).toFixed(2)}
                        </p>
                    )}
                    <div className="flex justify-between items-center">
                        <p className="text-sm sm:text-lg font-bold">
                            {item.variants.length} Colors
                        </p>
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        {item.type === "shoes" || item.type === "sandals" ? (
                            `Size (EU): ${findRangeOfSizes()}`
                        ) : item.type === "accessories" ? (
                            `Sizes: ${
                                item.variants.length > 0 && item.variants[0].sizes.length > 0
                                    ? item.variants[0].sizes.map(s => s.size).join(", ")
                                    : "N/A"
                            }`
                        ) : null}
                    </div>

                </header>
                <h2 className="absolute top-0 left-0 capitalize bg-black text-white p-1 text-sm">{item.manufacturer.replace("-", " ").toUpperCase()}</h2>
            </Link>
            <div className="absolute top-0 right-0 flex flex-col gap-1 p-1">
                {item.discount > 0 && (
                    <span
                        className="bg-yellow-500 text-white p-1 rounded-md font-medium text-sm">Extra {item.discount.toFixed(0)}% Off</span>
                )}
            </div>
            {outOfStocks && (
                <div className="absolute inset-0 bg-opacity-60 bg-gray-900 flex justify-center items-center">
                    <h2 className={`text-white p-2 rounded-lg text-sm md:text-lg font-bold tracking-wide ${outOfStocksLabel === "Coming Soon" ? "bg-yellow-500" : "bg-red-500"}`}>
                        {outOfStocksLabel}
                    </h2>
                </div>
            )}
        </article>
    );
};

export default ItemCard;
