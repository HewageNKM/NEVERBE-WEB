import React, {useEffect} from 'react';
import {AiFillFilter} from "react-icons/ai";
import {filterOptions, menu, shoeSizes} from "@/constants";
import ShoeCard from "@/components/ShoeCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getProducts} from "@/lib/features/productSlice/productSlice";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import Filters from "@/components/sections/products/Filters";
import {CiFilter} from "react-icons/ci";
import {IoFilter} from "react-icons/io5";

const Products = ({containerStyles, type}: { containerStyles: string, type:string}) => {
    const products = useSelector((state:RootState) => state.productSlice.products);
    const dispatch:AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);
    return (
        <div className={`${containerStyles} mt-2 w-full flex-row flex-wrap flex gap-5`}>
            <div className="flex w-full flex-col gap-5">
                <div className="w-full">
                    <h1 className="text-4xl font-bold">Products</h1>
                    <h2 className="text-sm capitalize font-light">The best place to find the best products</h2>
                </div>
                <div className="w-full flex items-center justify-between">
                    <div>
                        <button>
                            <IoFilter size={30} className="text-primary"/>
                        </button>
                    </div>
                    <label className="flex flex-row gap-2 justify-center items-center">
                        <div className="flex justify-center w-full items-center gap-2">
                            <AiFillFilter size={25} className="text-primary"/>
                            <p className="font-medium text-lg line-clamp-1">Sort: </p>
                        </div>
                        <select className="p-1 w-full border-2 border-primary rounded-md" defaultValue="all"
                                onChange={(event) => {
                                }}>
                            {filterOptions.map((filter, index) => (
                                <option key={index} className="text-primary font-bold"
                                        value={filter.value}>{filter.title}</option>))}
                        </select>
                    </label>
                </div>
            </div>
            <div className="flex w-full justify-center">
                <div className="flex-wrap flex pb-20 lg:gap-20 gap-28 w-full min-h-screen justify-center flex-row">
                    {products.map((product, index) => (
                        <ShoeCard shoe={product} key={index}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;