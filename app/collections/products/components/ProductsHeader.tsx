"use client";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import Image from "next/image";
import {DefaultBG} from "@/assets/images";

const ProductsHeader = ({gender}: { gender: string }) => {
    const {products} = useSelector((state: RootState) => state.productsSlice);

    return (
        <section className="flex relative flex-col gap-4 md:text-lg text-sm justify-between w-full">
            <div className="relative group overflow-hidden">
                <figure className="transition-transform duration-300 ease-in-out group-hover:scale-105">
                    <Image
                        src={DefaultBG}
                        alt="Products Header"
                        width={100}
                        height={100}
                        className="w-full object-cover h-[10rem] md:h-[20rem]"
                    />
                </figure>
                <div className="absolute capitalize inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    {(gender && gender !== "all") ? (
                        <h1 className="text-white text-lg md:text-3xl font-bold">
                            {gender.toWellFormed()} ({products.length || 0})
                        </h1>
                    ) : (
                        <h1 className="text-white text-lg md:text-3xl font-bold">
                            All Products ({products.length || 0})
                        </h1>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsHeader;
