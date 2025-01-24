"use client";
import React, {useEffect, useState} from 'react';
import DropShadow from "@/components/DropShadow";
import {IoClose} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {motion} from "framer-motion";
import {
    getInventory,
    resetFilter,
    setSelectedManufacturers,
    setSelectedSizes,
    setSelectedType,
    toggleFilter
} from "@/redux/productsSlice/productsSlice";
import {accessoriesSizes, productTypes, wearableSizes} from "@/constants";
import {BiReset} from "react-icons/bi";
import {getBrands} from "@/actions/inventoryAction";
import Skeleton from "@/components/Skeleton";

const PopUpFilter = () => {
    const {
        selectedSizes,
        selectedType,
        selectedManufacturers,
        page
    } = useSelector((state: RootState) => state.productsSlice);
    const [brands, setBrands] = useState([])
    const [isBrandsLoading, setIsBrandsLoading] = useState(true);
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

    const fetchBrand = async () => {
        try {
            const brands = await getBrands();
            setBrands(brands);
            setIsBrandsLoading(false);
        } catch (e: any) {
            console.log(e.message);
            setIsBrandsLoading(false);
        }
    }

    useEffect(() => {
        const gender = window.localStorage.getItem("gender") || "all";
        dispatch(getInventory({gender, page}));
    }, [selectedManufacturers, selectedType, selectedSizes, dispatch]);

    useEffect(() => {
        fetchBrand();
    }, []);

    return (
        <DropShadow containerStyle="flex justify-start items-start">
            <motion.section
                initial={{opacity: 0, x: "-100vw"}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: "-100vw"}}
                transition={{type: "tween", duration: 0.4, delay: 0.1}}
                className="bg-white px-6 pr-12 rounded-r-lg min-h-screen w-full md:w-[60vw] lg:w-[30vw] py-6 relative shadow-md"
            >
                <h2 className="text-2xl font-bold tracking-wider mb-4">Filter</h2>
                <div className="h-[90vh] overflow-auto hide-scrollbar mt-4 flex-col flex gap-8">
                    {/* Type Section */}
                    <div className="mt-5 px-2">
                        <h3 className="text-xl font-semibold"><strong>Type</strong></h3>
                        <div className="flex mt-2 flex-row gap-5 text-lg flex-wrap items-center">
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
                    </div>
                    {/* Brands Section */}
                    <div className="mt-5 px-2">
                        <h3 className="text-xl font-semibold"><strong>Brands</strong></h3>
                        <div className="flex relative mt-2 flex-row gap-5 text-lg flex-wrap items-center">
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
                            {isBrandsLoading && (
                                <div className="w-full h-16">
                                    <Skeleton/>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Sizes Section */}
                    <div className="px-2">
                        <h3 className="text-2xl font-semibold mt-5"><strong>Sizes</strong></h3>
                        <div className="mt-2">
                            {selectedType === "all" && (
                                <div className="flex mt-2 flex-row gap-3 text-xl flex-wrap items-center">
                                    {wearableSizes.map((size, index) => (
                                        <label key={index}
                                               className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
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
                                        <label key={index}
                                               className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
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
                            {(selectedType === "shoes" || selectedType === "sandals") && (
                                <div className="flex mt-2 flex-row gap-3 text-2xl flex-wrap items-center">
                                    {wearableSizes.map((size, index) => (
                                        <label key={index}
                                               className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
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
                            {selectedType === "accessories" && (
                                <div className="flex mt-2 flex-row gap-3 text-2xl flex-wrap items-center">
                                    {accessoriesSizes.map((size, index) => (
                                        <label key={index}
                                               className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                            <input
                                                value={size.toLowerCase()}
                                                checked={selectedSizes.includes(size.toLowerCase())}
                                                type="checkbox"
                                                onChange={() => addSize(size.toLowerCase())}
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
                <div className="top-3 right-2 absolute flex flex-row gap-3">
                    <button
                        onClick={() => dispatch(resetFilter())}
                        className="bg-yellow-500 flex mt-1 rounded-full p-3 text-white justify-center items-center text-sm font-bold hover:bg-yellow-600 transition duration-200"
                    >
                        <BiReset size={25}/>
                    </button>
                    <button
                        onClick={() => dispatch(toggleFilter())}
                        className="flex mt-1 p-2 rounded-lg text-gray-700 hover:text-red-500 transition duration-200"
                    >
                        <IoClose size={32}/>
                    </button>
                </div>
            </motion.section>
        </DropShadow>
    );
};

export default PopUpFilter;
