"use client"
import React from 'react';
import {Item} from "@/interfaces";
import Image from "next/image";
import {useRouter} from "next/navigation";

const SearchResultCard = ({item, onClick}: { item: Item, onClick: () => void }) => {
    const router = useRouter();
    const onNavigate = () => {
        onClick()
        router.push(`/collections/products/${item.itemId.toLowerCase()}`)
    }
    return (
        <div onClick={onNavigate}
             className="flex flex-row gap-2 p-2 rounded-md hover:bg-gray-200 items-center justify-start">
            <figure>
                <Image className="rounded-sm lg:w-[5rem] w-[4rem] h-[4rem] lg:h-[5rem]" src={item.thumbnail.url} alt={item.name} width={50} height={50}/>
            </figure>
            <div>
                <h1 className="font-semibold text-lg">{item.name}</h1>
                <div className="flex-row flex gap-1 items-center">
                    <p className={`text-sm  font-semibold ${item.discount > 0 ? "text-yellow-500":"text-red-500"}`}>Rs {(Math.round((item.sellingPrice - (item.discount * item.sellingPrice / 100)) / 10) * 10).toFixed(2)}</p>
                    <p className="text-gray-500 text-sm font-medium line-through">Rs {item.marketPrice}</p>
                </div>
                {item.discount > 0 && (
                    <div>
                        <p className="text-yellow-500 text-sm font-semibold">Limited Time Only</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultCard;