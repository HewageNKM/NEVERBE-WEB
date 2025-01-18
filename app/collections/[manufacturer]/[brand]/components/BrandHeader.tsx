"use client"
import React from 'react';
import Image from "next/image";
import {DefaultBG} from "@/assets/images";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

const ManufacturerHeader = ({manufacturer, brand}: { manufacturer: string, brand: string }) => {
    const {products} = useSelector((state: RootState) => state.brandSlice);
    return (
        <section className="flex relative flex-col gap-4 md:text-lg text-sm justify-between w-full">
            <div className="relative group overflow-hidden">
                <figure className="transition-transform duration-300 ease-in-out group-hover:scale-105">
                    <Image
                        src={DefaultBG}
                        alt="Shoes Background"
                        width={100}
                        height={100}
                        className="w-full object-cover h-[10rem] md:h-[20rem]"
                    />
                </figure>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <h1 className="text-white text-lg md:text-3xl font-bold"><span
                        className="capitalize">{manufacturer.toWellFormed()} {brand.toWellFormed()}</span> ({products.length || 0})
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default ManufacturerHeader;