"use client";
import React, { useEffect } from 'react';
import DropShadow from "@/components/DropShadow";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { motion } from "framer-motion";
import {
    filterProducts,
    resetFilter,
    setSelectedManufacturers,
    setSelectedSizes,
    setSelectedType,
    toggleFilter
} from "@/redux/productsSlice/productsSlice";
import { accessoriesSizes, brands, productTypes, wearableSizes } from "@/constants";
import { BiReset } from "react-icons/bi";

const Filter = () => {
    const { selectedSizes, selectedType, selectedManufacturers,productType } = useSelector((state: RootState) => state.productsSlice);
    const dispatch: AppDispatch = useDispatch();

    const addBrand = (value: string) => {
        if (selectedManufacturers.includes(value)) {
            dispatch(setSelectedManufacturers(selectedManufacturers.filter(brand => brand !== value)));
        } else {
            dispatch(setSelectedManufacturers([...selectedManufacturers, value]));
        }
    }

    const addSize = (value: string) => {
        if (selectedSizes.includes(value)) {
            dispatch(setSelectedSizes(selectedSizes.filter(size => size !== value)));
        } else {
            dispatch(setSelectedSizes([...selectedSizes, value]));
        }
    }

    useEffect(() => {
        dispatch(filterProducts());
    }, [selectedManufacturers, selectedType, selectedSizes, dispatch]);

    return (
        <DropShadow containerStyle="flex justify-start items-start">
            <motion.section
                initial={{ opacity: 0, x: "-100vw" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "-100vw" }}
                transition={{ type: "tween", duration: 0.4, delay: 0.1 }}
                className="bg-white px-6 pr-12 rounded-r-lg min-h-screen w-full md:w-[60vw] lg:w-[30vw] py-6 relative shadow-md"
            >
                <h2 className="text-4xl font-bold tracking-wider mb-4">Filter</h2>
                <div className="h-[90vh] overflow-auto mt-4 flex-col flex gap-8">
                    {/* Type Section */}
                    {productType == "all" && (<div className="mt-5 px-2">
                        <h3 className="text-3xl font-semibold"><strong>Type</strong></h3>
                        <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                            {productTypes.map((type, index) => (
                                <label key={index}
                                       className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                    <input
                                        checked={selectedType === type.value}
                                        type="radio"
                                        onChange={() => {
                                            dispatch(setSelectedType(type.value));
                                            dispatch(setSelectedSizes([]));
                                        }}
                                        className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-800 font-medium">{type.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>)}
                    {/* Brands Section */}
                    <div className="mt-5 px-2">
                        <h3 className="text-3xl font-semibold"><strong>Brands</strong></h3>
                        <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                            {brands.map((brand, index) => (
                                <label key={index}
                                       className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                    <input
                                        value={brand.value}
                                        checked={selectedManufacturers.includes(brand.value)}
                                        type="checkbox"
                                        onChange={() => addBrand(brand.value)}
                                        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-800 font-medium">{brand.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Sizes Section */}
                    <div className="px-2">
                        <h3 className="text-4xl font-semibold mt-5"><strong>Sizes</strong></h3>
                        <div className="mt-2">
                            {selectedType === "all" && (
                                <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                                    {wearableSizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                            <input
                                                value={size}
                                                checked={selectedSizes.includes(size)}
                                                type="checkbox"
                                                onChange={() => addSize(size)}
                                                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-800 font-medium">Size {size}</span>
                                        </label>
                                    ))}
                                    {accessoriesSizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                            <input
                                                value={size}
                                                checked={selectedSizes.includes(size)}
                                                type="checkbox"
                                                onChange={() => addSize(size)}
                                                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-800 font-medium">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {(selectedType === "shoes" || selectedType === "slippers") && (
                                <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                                    {wearableSizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                            <input
                                                value={size}
                                                checked={selectedSizes.includes(size)}
                                                type="checkbox"
                                                onChange={() => addSize(size)}
                                                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-800 font-medium">Size {size}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {(selectedType === "accessories" || selectedType === "socks") && (
                                <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                                    {accessoriesSizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                            <input
                                                value={size}
                                                checked={selectedSizes.includes(size)}
                                                type="checkbox"
                                                onChange={() => addSize(size)}
                                                className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-800 font-medium">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="top-0 right-0 absolute flex flex-row gap-5">
                    <button
                        onClick={() => dispatch(resetFilter())}
                        className="bg-yellow-500 flex mt-1 p-2 rounded-lg text-white justify-center items-center text-sm font-bold hover:bg-yellow-600 transition duration-200"
                    >
                        <BiReset size={24} />
                        <span className="ml-2">Reset</span>
                    </button>
                    <button
                        onClick={() => dispatch(toggleFilter())}
                        className="flex mt-1 p-2 rounded-lg text-gray-700 hover:text-red-500 transition duration-200"
                    >
                        <IoClose size={32} />
                    </button>
                </div>
            </motion.section>
        </DropShadow>
    );
};

export default Filter;
