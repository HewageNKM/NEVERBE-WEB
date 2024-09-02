import React, {useEffect} from 'react';
import {AiFillFilter} from "react-icons/ai";
import {filterOptions, menu, shoeSizes} from "@/constants";
import ShoeCard from "@/components/ShoeCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/lib/store";
import {getProducts} from "@/lib/features/productSlice/productSlice";
import {FaArrowDown, FaArrowUp} from "react-icons/fa";
import Filters from "@/components/Filters";
import {CiFilter} from "react-icons/ci";
import {IoFilter} from "react-icons/io5";

const Products = ({containerStyles}:{containerStyles:string}) => {
    const products = useSelector((state:RootState) => state.productSlice.products);
    const dispatch:AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    return (
        <div className={`${containerStyles} w-full flex-row flex-wrap flex gap-5`}>
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