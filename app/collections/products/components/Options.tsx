"use client"
import React, {useEffect} from "react";
import {RxMixerHorizontal} from "react-icons/rx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {filterProducts, setSelectedSort, toggleFilter} from "@/redux/productsSlice/productsSlice";
import {sortingOptions} from "@/constants";
import {IoFilter} from "react-icons/io5";

const Options = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedSort = useSelector((state: RootState) => state.productsSlice.selectedSort);

    useEffect(() => {
        dispatch(filterProducts());
    }, [dispatch, selectedSort]);
    return (
        <section className="mt-10 flex flex-row gap-4 md:text-lg text-sm justify-between w-full">
            <div className="flex font-semibold tracking-wide flex-row gap-2 justify-center items-center">
                <button
                    onClick={() => dispatch(toggleFilter())}
                    className="text-blue-600 hover:text-blue-800 transition duration-200"
                >
                    Filters
                </button>
                <RxMixerHorizontal size={25} className="text-blue-600"/>
            </div>
            <div className="flex flex-col">
                <div className="flex-row flex gap-2 justify-center items-center">
                    <IoFilter size={25}/>
                    <select
                        id="sorting"
                        onChange={(event) => dispatch(setSelectedSort(event.target.value))}
                        defaultValue={selectedSort}
                        className="appearance-none p-2 text-sm w-fit rounded-lg font-medium bg-slate-100 border border-slate-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-700"
                    >
                        {sortingOptions.map((option, index) => (
                            <option
                                key={index}
                                value={option.value}
                                className="bg-white text-gray-700 font-medium"
                            >
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
};

export default Options;
