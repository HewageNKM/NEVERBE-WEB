"use client";
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {setSelectedSort, sortProducts} from "@/redux/productsSlice/productsSlice";
import {sortingOptions} from "@/constants";
import {IoFilter} from "react-icons/io5";

const Options = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedSort = useSelector((state: RootState) => state.productsSlice.selectedSort);

    useEffect(() => {
        dispatch(sortProducts());
    }, [dispatch, selectedSort]);

    return (
        <section className="mt-10 flex flex-row  items-center justify-end w-full">
            <div className="flex-row flex gap-2 justify-center items-center">
                <IoFilter size={25}/>
                <select
                    id="sorting"
                    onChange={(event) => dispatch(setSelectedSort(event.target.value))}
                    defaultValue={selectedSort}
                    className="appearance-none text-sm p-2 w-fit rounded-lg font-medium bg-slate-100 border border-slate-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 text-gray-700"
                >
                    {sortingOptions.map((option, index) => (
                        <option
                            key={index}
                            value={option.value}
                            className="bg-white text-gray-700"
                        >
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

export default Options;
