"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setSelectedSort, sortProducts } from "@/redux/productsSlice/productsSlice";
import { sortingOptions } from "@/constants";

const Options = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedSort = useSelector((state: RootState) => state.productsSlice.selectedSort);

    useEffect(() => {
        dispatch(sortProducts());
    }, [dispatch, selectedSort]);

    return (
        <section className="mt-10 flex flex-row  items-center justify-end w-full">
            <div className="flex flex-col">
                <label htmlFor="sorting" className="text-lg font-bold">Sort by</label>
                <select
                    id="sorting"
                    onChange={(event) => dispatch(setSelectedSort(event.target.value))}
                    defaultValue={selectedSort}
                    className="p-2 rounded-lg font-medium bg-slate-200 border border-slate-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                >
                    {sortingOptions.map((option, index) => (
                        <option key={index} value={option.value} className="bg-white font-medium">
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

export default Options;
