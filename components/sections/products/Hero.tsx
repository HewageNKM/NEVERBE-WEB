import React from 'react';
import {IoFilter} from "react-icons/io5";
import {AiFillFilter} from "react-icons/ai";
import {filterOptions} from "@/constants";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {toggleFilter} from "@/lib/features/filterSlice/filterSlice";

const Hero = ({containerStyles}:{containerStyles:string}) => {
    const dispatch:AppDispatch = useDispatch();

    return (
        <div className={`${containerStyles} flex w-full flex-col gap-5`}>
            <div className="w-full">
                <h1 className="text-4xl font-bold">Products</h1>
                <h2 className="text-sm capitalize font-light">The best place to find the best products</h2>
            </div>
            <div className="w-full flex items-center justify-between">
                <div>
                    <button onClick={()=> dispatch(toggleFilter())}>
                        <IoFilter size={30} className="text-primary"/>
                    </button>
                </div>
                <label className="flex flex-row gap-2 justify-center items-center">
                    <div className="flex justify-center w-full items-center gap-2">
                        <AiFillFilter size={25} className="text-primary"/>
                        <p className="font-medium text-lg line-clamp-1">Sort: </p>
                    </div>
                    <select className="p-1 w-fit text-primary font-medium border-2 border-primary rounded-md"
                            defaultValue="all"
                            onChange={() => {
                            }}>
                        {filterOptions.map((filter, index) => (
                            <option key={index} className="text-primary font-bold"
                                    value={filter.value}>{filter.title}</option>))}
                    </select>
                </label>
            </div>
        </div>
    );
};

export default Hero;