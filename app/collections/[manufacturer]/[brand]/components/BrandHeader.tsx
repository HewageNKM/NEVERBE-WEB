"use client"
import React, {useEffect} from 'react';
import Image from "next/image";
import {DefaultBG} from "@/assets/images";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {getItemsByTwoField} from "@/redux/brandSlice/brandSlice";

const ManufacturerHeader = ({manufacturer, brand}: { manufacturer: string, brand: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const {products, selectedSort} = useSelector((state: RootState) => state.brandSlice);
    const {user} = useSelector((state: RootState) => state.authSlice);

    useEffect(() => {
        if (user) {
            dispatch(getItemsByTwoField({
                value1: manufacturer,
                value2: brand,
                field1: "manufacturer",
                field2: "brand"
            }));
        }
    }, [selectedSort, user]);
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