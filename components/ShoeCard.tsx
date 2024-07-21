import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {Skeleton} from "@mui/material";

const ShoeCard = ({title, thumbnail, sellingPrice, type, color, shoeId}: {
    title: string,
    thumbnail: string,
    sellingPrice: number,
    type?: string,
    color: string,
    shoeId: string
}) => {
    return (
        <Link href={`/products/${shoeId}`} target='_blank'>
            <div
                className="flex hover:shadow cursor-pointer hover:scale-105 transition-all duration-300 relative p-2 flex-col w-[15rem]">
                <div>
                    {thumbnail ? (<Image src={thumbnail} alt="" className="w-full h-[40vh] bg-contain" width={2000}
                                         height={2000}/>) : (
                        <Skeleton animation="wave" sx={{width:'100%',height:'40vh',background: "rgb(243 244 246)"}}/>
                    )}
                </div>
                <div className="mt-2 flex flex-col gap-1">
                    <div>
                        <h2 className="line-clamp-1 font-bold text-lg capitalize">{title || <Skeleton animation="wave" sx={{background: "rgb(243 244 246)"}}/>}</h2>
                    </div>
                    <div>
                        <h2 className="capitalize font-medium text-sm">{color || <Skeleton animation="wave" sx={{background: "rgb(243 244 246)"}}/>}</h2>
                    </div>
                    <div>
                        <h2 className="font-medium text-sm">රු {sellingPrice || <Skeleton animation="wave" sx={{background: "rgb(243 244 246)"}}/>}</h2>
                    </div>
                </div>
                {type === "new" &&
                    <div
                        className="bg-green-400 font-light absolute text-white top-1 left-1 text-sm w-fit p-1">New</div>}
                {type === "popular" &&
                    <div className="bg-red-500 font-light text-white absolute top-1 left-1 text-sm w-fit p-1">Hot</div>}
            </div>
        </Link>
    );
};

export default ShoeCard;