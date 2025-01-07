"use client";
import React, { useEffect, useState } from 'react';
import { Item } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";

const ItemCard = ({ item }: { item: Item }) => {
    const [outOfStocks, setOutOfStocks] = useState(false);
    const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");

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
        checkOutOfStocks();
    }, [item]);

    return (
        <article className="relative w-[8rem] md:w-[13rem]  h-auto max-w-xs transition-transform duration-300 transform hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white">
            <Link href={`/collections/products/${item.itemId.toLowerCase()}`} aria-label={`View details for ${item.name}`}>
                <figure className="relative overflow-hidden rounded-lg">
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
                    <h2 className="text-primary font-semibold text-sm md:text-lg">{item.name}</h2>
                    <div className="flex flex-row items-center flex-wrap gap-1">
                        {item.discount > 0 && (
                            <p className="line-through font-bold text-gray-500 text-sm">
                                Rs. {(item.sellingPrice + (item.sellingPrice * item.discount / 100)).toFixed(2)}
                            </p>
                        )}
                        <p className="text-red-500 text-sm font-bold">Rs. {item.sellingPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm sm:text-lg font-semibold">
                            {item.variants.length} Colors
                        </p>
                    </div>
                </header>
                <h2 className="absolute top-0 left-0 capitalize bg-black text-white p-1 text-sm">{item.manufacturer.replace("-"," ")}</h2>
            </Link>
            <div className="absolute top-0 right-0 flex flex-col gap-1 p-1">
                {item.discount > 0 && (
                    <span className="bg-red-500 text-white p-1 rounded-md font-medium text-sm">{item.discount}%</span>
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
