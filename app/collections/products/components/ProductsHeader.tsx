"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getInventory } from "@/redux/productsSlice/productsSlice";
import Image from "next/image";
import { ShoesBackground } from "@/assets/images";

const ProductsHeader = ({ count }: { count: number }) => {
    const dispatch: AppDispatch = useDispatch();
    const selectedSort = useSelector((state: RootState) => state.productsSlice.selectedSort);

    useEffect(() => {
        dispatch(getInventory());
    }, [dispatch, selectedSort]);

    return (
        <section className="flex relative flex-col gap-4 md:text-lg text-sm justify-between w-full">
            <div className="relative group overflow-hidden">
                <figure className="transition-transform duration-300 ease-in-out group-hover:scale-105">
                    <Image
                        src={ShoesBackground}
                        alt="Shoes Background"
                        width={100}
                        height={100}
                        className="w-full object-cover h-[10rem] md:h-[20rem]"
                    />
                </figure>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <h1 className="text-white text-lg md:text-3xl font-bold">
                        All Products ({count || 0})
                    </h1>
                </div>
            </div>
        </section>
    );
};

export default ProductsHeader;
