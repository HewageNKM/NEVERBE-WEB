"use client";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {getInventory} from "@/redux/productsSlice/productsSlice";
import Image from "next/image";
import {DefaultBG} from "@/assets/images";

const ProductsHeader = ({gender}: { gender: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const {selectedSort, products} = useSelector((state: RootState) => state.productsSlice);
    const {user} = useSelector((state: RootState) => state.authSlice);

    useEffect(() => {
        if (user) {
            dispatch(getInventory({gender}));
        }
    }, [dispatch, selectedSort, user]);

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
                <div className="absolute capitalize inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    {(gender && gender !== "all") ? (
                        <h1 className="text-white text-lg md:text-3xl font-bold">
                            All Products By {gender} ({products.length || 0})
                        </h1>
                    ):(
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
