"use client";
import React, {useEffect} from 'react';
import DropShadow from "@/components/DropShadow";
import {IoClose} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {motion} from "framer-motion";
import {getItemsByTwoField, resetFilter, setSelectedSizes, toggleFilter} from "@/redux/brandSlice/brandSlice";
import {wearableSizes} from "@/constants";
import {BiReset} from "react-icons/bi";

const BrandTopUpFilter = () => {
    const {
        selectedSizes,
        page,
        size
    } = useSelector((state: RootState) => state.brandSlice);
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
        if(user) {
            const manufacturer = window.localStorage.getItem('manufacturer');
            const brand = window.localStorage.getItem('brand');
            dispatch(getItemsByTwoField({value1:manufacturer, value2:brand, field1:"manufacturer", field2:"brand",page,size}));
        }
    }, [selectedSizes, dispatch, user]);
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
                    {/* Sizes Section */}
                    <div className="px-2">
                        <h3 className="text-2xl font-semibold mt-5"><strong>Sizes</strong></h3>
                        <div className="mt-2">
                            <div className="flex mt-2 flex-row gap-3 text-2xl flex-wrap items-center">
                                {wearableSizes.map((size, index) => (
                                    <label key={index}
                                           className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded p-2 transition duration-200">
                                        <input
                                            value={size.toLowerCase()}
                                            checked={selectedSizes.includes(size.toLowerCase())}
                                            type="checkbox"
                                            onChange={() => addSize(size.toLowerCase())}
                                            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800 font-medium">Size {size}</span>
                                    </label>
                                ))}
                            </div>
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

export default BrandTopUpFilter;
