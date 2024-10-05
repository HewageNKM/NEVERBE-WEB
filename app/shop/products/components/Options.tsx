"use client"
import React from 'react';
import {RxMixerHorizontal} from "react-icons/rx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";
import {toggleFilter} from "@/redux/productsSlice/productsSlice";
import {sortingOptions} from "@/constants";

const Options = () => {
    const dispatch:AppDispatch = useDispatch();
    return (
        <section className="mt-10 flex flex-row gap-2 md:text-lg text-sm justify-between w-full">
            <div
                className="flex font-semibold tracking-wide flex-row gap-2 justify-center items-center">
                <button onClick={()=>dispatch(toggleFilter())}>Filters</button>
                <RxMixerHorizontal size={25}/>
            </div>
            <div>
                <label>
                    <select defaultValue="" className="p-2 rounded-lg font-medium bg-slate-200">
                        {sortingOptions.map((option, index) => (
                            <option key={index} value={option.value} className="bg-white font-medium">{option.name}</option>
                        ))}
                    </select>
                </label>
            </div>
        </section>
    );
};

export default Options;