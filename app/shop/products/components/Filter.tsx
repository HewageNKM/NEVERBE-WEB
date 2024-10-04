"use client"
import React, {useEffect} from 'react';
import DropShadow from "@/components/DropShadow";
import {IoClose} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {motion} from "framer-motion";
import {setSelectedBrands, setSelectedSizes, setSelectedType, toggleFilter} from "@/redux/productsSlice/productsSlice";
import {accessoriesSizes, brands, productTypes, wearableSizes} from "@/constants";

const Filter = () => {
    const {selectedSizes, selectedType, selectedBrands} = useSelector((state: RootState) => state.productsSlice);
    const dispatch: AppDispatch = useDispatch();


    const addBrand = (value: string) => {
        if (selectedBrands.includes(value)) {
            dispatch(setSelectedBrands(selectedBrands.filter(brand => brand !== value)))
        } else {
            dispatch(setSelectedBrands([...selectedBrands, value]))
        }
    }

    const addSize = (value: string) => {
        if (selectedSizes.includes(value)) {
            dispatch(setSelectedSizes(selectedSizes.filter(size => size !== value)))
        } else {
            dispatch(setSelectedSizes([...selectedSizes, value]))
        }
    }

    useEffect(() => {

    }, [selectedBrands, selectedType, selectedSizes]);

    return (
        <DropShadow containerStyle="flex justify-start items-start">
            <motion.div initial={{opacity: 0, x: "-100vw"}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: "-100vw"}}
                        transition={{type: "tween", duration: 0.4, delay: 0.1}}
                        className="bg-white px-4 pr-12 rounded-r-lg min-h-screen w-full md:w-[60vw] lg:w-[30vw] py-2 relative">
                <h1 className="text-4xl font-bold tracking-wider">Filters</h1>
                <div className="h-[90vh] overflow-auto mt-5 flex-col flex gap-8">
                    <div className="mt-5 px-2">
                        <h2 className="text-3xl font-bold">Type</h2>
                        <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                            {productTypes.map((type, index) => (
                                <label key={index} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        checked={selectedType === type.value}
                                        type="radio"
                                        onChange={() => {
                                            dispatch(
                                                setSelectedType(type.value),
                                                setSelectedSizes([])
                                            )
                                        }}
                                        className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-800 font-medium">{type.name}</span>
                                </label>

                            ))}
                        </div>
                    </div>
                    <div className="mt-5 px-2">
                        <h2 className="text-3xl font-bold">Brands</h2>
                        <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                            {brands.map((brand, index) => (
                                <label key={index} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        value={brand.value}
                                        checked={selectedBrands.includes(brand.value)}
                                        type="checkbox"
                                        onChange={() => addBrand(brand.value)}
                                        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-800 font-medium">{brand.name}</span>
                                </label>

                            ))}
                        </div>
                    </div>
                    <div className="px-2">
                        <h2 className="text-4xl font-bold  mt-5">Sizes</h2>
                        <div className="mt-2 ">
                            {selectedType == "all" && (
                                <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                                    {wearableSizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer">
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
                                        <label key={index} className="flex items-center gap-2 cursor-pointer">
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
                            {(selectedType == "shoe" || selectedType == "scandals") && (
                                <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                                    {wearableSizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer">
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
                            {selectedType == "accessories" && (
                                <div className="flex mt-2 flex-row gap-5 text-2xl flex-wrap items-center">
                                    {accessoriesSizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 cursor-pointer">
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
                <button className="top-0 right-0 absolute">
                    <IoClose onClick={() => dispatch(toggleFilter())} size={40}/>
                </button>
            </motion.div>
        </DropShadow>
    );
};

export default Filter;