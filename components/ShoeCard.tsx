import React from 'react';
import Image from "next/image";
import Link from "next/link";
import {Rating} from "@mui/material";

const ShoeCard = ({shoe, type}: {
    shoe: object,
    type?: string
}) => {
    return (
        <Link href={`/products/${shoe.shoeId}`} target='_blank'>
            <div
                className="flex cursor-pointer hover:scale-105 transition-all duration-300 relative p-2 flex-col w-[15rem]">
                <div>
                    <Image src={shoe.thumbnail} alt="" className="w-full md:w-[15rem] rounded-lg h-[20rem] bg-contain" width={2000}
                           height={2000}/>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                    <div>
                        <h2 className="line-clamp-1 font-bold text-lg capitalize">{shoe.title}</h2>
                    </div>
                    <div className="flex text-lg flex-row justify-start gap-2 items-center">
                        <Rating size={"medium"} readOnly value={shoe?.rating} precision={0.1}/>
                        <p className="font-medium">{shoe.rating}</p>
                    </div>
                    <div className="flex flex-row gap-4 justify-start items-center">
                        <div className="relative w-fit">
                            <h2 className="font-medium text-lg">රු {shoe.sellingPrice + 2000}</h2>
                            <div className="h-[1.1px] absolute top-1/2 left-0 w-[4.2rem] bg-black"/>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-primary">රු {shoe.sellingPrice}</h2>
                        </div>
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