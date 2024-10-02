"use client"
import React, {useEffect, useState} from 'react';
import {Item} from "@/interfaces";
import Image from "next/image";
import Link from "next/link";

const ItemCard = ({item,flag}:{item:Item,flag:string}) => {
    const [outOfStocks, setOutOfStocks] = useState(false);

    const checkOutOfStocks = () => {

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
    });

    return (
        <div className="md:w-[16rem] md:h-[25rem] w-full shadow relative rounded-lg">
            <Link href={`/products/overview/${item.itemId.toLowerCase()}`}>
                <div>
                    <Image width={300} height={300} src={item.thumbnail} alt={item.name}
                           className="md:w-[16rem] w-full md:h-[17rem] rounded-t-lg"/>
                </div>
                <div className="capitalize px-2 flex flex-col gap-1 mt-2 md:text-xl text-lg font-medium">
                    <h2 className="text-primary font-semibold tracking-wider">{item.name}</h2>
                    <div className="flex justify-between">
                        <p className="text-red-500">{"Rs. " + item.sellingPrice}</p>
                        {item.discount > 0 &&
                            <p className="line-through text-gray-500">{"Rs. " + (item.sellingPrice + (item.sellingPrice * item.discount / 100)).toFixed(2)}</p>}
                    </div>
                    <div className="w-full flex items-end justify-end">
                        <p className="text-xl text-yellow-400 font-medium">{item.variants.length + " Colors"}</p>
                    </div>
                </div>
                <h2 className="absolute top-0 capitalize bg-black text-white p-1 font-medium">{item.manufacturer}</h2>
            </Link>
            <div className='absolute top-0 right-0 flex flex-col gap-1'>
                {flag === "new" && <h2 className="right-0 bg-green-500 text-white p-1 font-medium">New</h2>}
                {item.discount > 0 &&
                    <h2 className="right-0 bg-red-500 text-white p-1 font-medium">{item.discount + "%"}</h2>}
            </div>
            {outOfStocks && (<div className="bg-white absolute top-0 left-0 w-full h-full bg-opacity-60 flex justify-center items-center">
                <h2 className=" bg-red-500 text-white p-1 font-medium">Out of Stock</h2>
            </div>)}
        </div>
    );
};

export default ItemCard;