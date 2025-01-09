"use client";
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {
    getItemsByManufacturer,
    resetFilter,
    setSelectedSizes,
    setSelectedType
} from "@/redux/manufacturerSlice/manufacturerSlice";
import {accessoriesSizes, productTypes, wearableSizes} from "@/constants";
import {BiReset} from "react-icons/bi";

const ManufacturerFilter = ({manufacturer}: { manufacturer: string }) => {
    const {
        selectedSizes,
        selectedType,
        selectedSort
    } = useSelector((state: RootState) => state.manufacturerSlice);
    const {user} = useSelector((state: RootState) => state.authSlice);
    const dispatch: AppDispatch = useDispatch();


    const addSize = (value: string) => {
        if (selectedSizes.includes(value)) {
            dispatch(setSelectedSizes(selectedSizes.filter(size => size !== value)));
        } else {
            dispatch(setSelectedSizes([...selectedSizes, value]));
        }
    }

    useEffect(() => {
        if (user && manufacturer) {
            dispatch(getItemsByManufacturer(manufacturer));
        }
    }, [selectedType, selectedSizes, dispatch, user, selectedSort, manufacturer]);


    return (
        <section className="flex justify-start items-start border-r-2 mb-10 w-fit h-full overflow-auto hide-scrollbar">
            <div className="hidden lg:block lg:w-[20vw] relative">
                <h2 className="text-2xl font-bold tracking-wider mb-4">Filter</h2>
                <div className="mt-4 flex-col flex gap-8">
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
                <div className="-top-1 right-2 absolute flex flex-row gap-3">
                    <button
                        onClick={() => dispatch(resetFilter())}
                        className="bg-yellow-500 flex mt-1 rounded-full p-1.5 text-white justify-center items-center text-sm font-bold hover:bg-yellow-600 transition duration-200"
                    >
                        <BiReset size={25}/>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ManufacturerFilter;
