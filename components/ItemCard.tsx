"use client"
import React, { useEffect, useState } from 'react';
import { Item } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";

const ItemCard = ({ item, flag }: { item: Item, flag: string }) => {
    const [outOfStocks, setOutOfStocks] = useState(false);
    const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");

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
                if (item.variants[i].sizes[j].stock === 0) {
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
    }

    useEffect(() => {
        checkOutOfStocks();
    }, [item]);

    return (
        <article className="w-full max-w-xs lg:max-w-sm transition-all h-auto shadow-lg relative rounded-lg overflow-hidden bg-white">
            <Link href={`/shop/products/${item.itemId.toLowerCase()}`} aria-label={`View details for ${item.name}`}>
                <figure>
                    <Image
                        width={300}
                        height={300}
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-[17rem] lg:h-[21rem] object-cover"
                        priority // Load this image with high priority for better performance
                    />
                </figure>
                <header className="capitalize px-4 py-2 flex flex-col gap-1">
                    <h2 className="text-primary font-semibold tracking-wider text-xl">{item.name}</h2>
                    <div className="flex flex-col justify-between">
                        {item.discount > 0 && (
                            <p className="line-through text-gray-500">
                                Rs. {(item.sellingPrice + (item.sellingPrice * item.discount / 100)).toFixed(2)}
                            </p>
                        )}
                        <p className="text-red-500 text-lg">Rs. {item.sellingPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-end">
                        <p className="text-xl text-yellow-400 font-medium">
                            {item.variants.length} {item.type === "shoes" ? "Colors" : "Sizes"}
                        </p>
                    </div>
                </header>
                <h2 className="absolute top-0 capitalize bg-black text-white p-2 font-medium">{item.manufacturer}</h2>
            </Link>
            <div className="absolute top-0 right-0 flex flex-col gap-1 p-2">
                {flag === "new" && (
                    <h3 className="bg-green-500 text-white p-1 font-medium">New</h3>
                )}
                {item.discount > 0 && (
                    <h3 className="bg-red-500 text-white p-1 font-medium">{item.discount}%</h3>
                )}
            </div>
            {outOfStocks && (
                <div className="bg-white absolute top-0 left-0 w-full h-full bg-opacity-60 flex justify-center items-center">
                    <h2 className={`text-white p-2 rounded-lg font-bold tracking-wide ${outOfStocksLabel === "Coming Soon" ? "bg-yellow-500" : "bg-red-500"}`}>
                        {outOfStocksLabel}
                    </h2>
                </div>
            )}
        </article>
    );
};

export default ItemCard;
