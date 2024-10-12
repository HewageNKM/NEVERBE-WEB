"use client"
import React, {useEffect, useState} from 'react';
import {Item} from "@/interfaces";
import Image from "next/image";
import Link from "next/link";

const ItemCard = ({item,flag}:{item:Item,flag:string}) => {
    const [outOfStocks, setOutOfStocks] = useState(false);
    const [outOfStocksLabel, setOutOfStocksLabel] = useState("Out of Stock");

    const checkOutOfStocks = () => {
        if(item.variants.length === 0){
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
    }

    useEffect(() => {
        checkOutOfStocks();
    },[item]);

    return (
        <article className="w-[16rem] lg:w-[20rem] transition-all h-[25.5rem] lg:h-[30.5rem] shadow relative rounded-lg">
            <Link href={`/shop/products/${item.itemId.toLowerCase()}`}>
                <figure>
                    <Image width={300} height={300} src={item.thumbnail} alt={item.name}
                           className="w-[16rem] h-[17rem] lg:h-[21rem] lg:w-[20rem] rounded-t-lg"/>
                </figure>
                <div className="capitalize px-2 transition-all flex flex-col gap-1 mt-2 md:text-2xl text-xl font-medium">
                    <h2 className="text-primary font-semibold tracking-wider">{item.name}</h2>
                    <div className="flex flex-col justify-between">
                        {item.discount > 0 && <p className="line-through text-gray-500">{"Rs. " + (item.sellingPrice + (item.sellingPrice * item.discount / 100)).toFixed(2)}</p>}
                        <p className="text-red-500">{"Rs. " + item.sellingPrice.toFixed(2)}</p>
                    </div>
                    <div className="w-full flex items-end justify-end">
                        <p className="md:text-2xl text-xl text-yellow-400 font-medium">{item.variants.length + `${item.type == "shoes" ? " Colors":" Sizes"}`}</p>
                    </div>
                </div>
                <h2 className="absolute top-0 capitalize bg-black text-white p-1 font-medium">{item.manufacturer}</h2>
            </Link>
            <div className='absolute top-0 right-0 flex flex-col gap-1'>
                {flag === "new" && <h3 className="right-0 bg-green-500 text-white p-1 font-medium">New</h3>}
                {item.discount > 0 &&
                    <h3 className="right-0 bg-red-500 text-white p-1 font-medium">{item.discount + "%"}</h3>}
            </div>
            {outOfStocks && (<div className="bg-white absolute top-0 left-0 w-full h-full bg-opacity-60 flex justify-center items-center">
                <h2 className={`text-white p-2 rounded-lg font-bold tracking-wide ${outOfStocksLabel === "Coming Soon" ? "bg-yellow-500":"bg-red-500"}`} >{outOfStocksLabel}</h2>
            </div>)}
        </article>
    );
};

export default ItemCard;