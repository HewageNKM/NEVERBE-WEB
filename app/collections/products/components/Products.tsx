"use client";
import React, {useEffect} from 'react';
import ItemCard from "@/components/ItemCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import EmptyState from "@/components/EmptyState";
import {Item} from '@/interfaces';
import {setProducts, setSelectedSort, toggleFilter} from "@/redux/productsSlice/productsSlice";
import Filter from "@/app/collections/products/components/Filter";
import {IoFilter} from "react-icons/io5";
import {sortingOptions} from "@/constants";
import {FiFilter} from "react-icons/fi";

const Products = ({items}: { items: Item[] }) => {
    const dispatch: AppDispatch = useDispatch();
    const products = useSelector((state: RootState) => state.productsSlice.products);
    const selectedSort = useSelector((state: RootState) => state.productsSlice.selectedSort);


    useEffect(() => {
        dispatch(setProducts(items));
    }, [dispatch, items]);

    return (
        <section className="w-full flex lg:grid lg:grid-cols-5 lg:gap-32 pt-5 flex-row">
            <div className="lg:block hidden">
                <Filter/>
            </div>
            <div className="col-span-4 w-full">
                <div className="flex-row flex gap-2 lg:justify-end justify-between items-center">
                    {/* Smaller filter icon */}
                    <div className="lg:hidden block">
                        <button onClick={() => dispatch(toggleFilter())}>
                            <FiFilter size={30} className="text-gray-500"/>
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <IoFilter size={30} className="text-gray-500"/>
                        <div className="relative">
                            <select
                                id="sorting"
                                onChange={(event) => dispatch(setSelectedSort(event.target.value))}
                                defaultValue={selectedSort}
                                className="bg-white text-gray-700 font-medium border border-gray-300 rounded-md p-2 cursor-pointer"
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

                </div>
                <ul className="flex flex-row gap-1 mb-10 md:gap-10 flex-wrap mt-5 w-full">
                    {products.map((item) => (
                        <li key={item.itemId}>
                            <ItemCard item={item}/>
                        </li>
                    ))}
                </ul>
                {products.length === 0 && <EmptyState message={"Products Not Available!"}/>}
            </div>
        </section>
    );
};

export default Products;
