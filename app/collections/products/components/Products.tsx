"use client";
import Pagination from '@mui/material/Pagination';
import React, {useEffect} from 'react';
import ItemCard from "@/components/ItemCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import EmptyState from "@/components/EmptyState";
import {Item} from '@/interfaces';
import {getInventory, setPage, setProducts, setSelectedSort, toggleFilter} from "@/redux/productsSlice/productsSlice";
import ProductsFilter from "@/app/collections/products/components/ProductsFilter";
import {IoFilter} from "react-icons/io5";
import {sortingOptions} from "@/constants";
import {FiFilter} from "react-icons/fi";
import ComponentLoader from "@/components/ComponentLoader";

const Products = ({items, gender}: { items: Item[], gender: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.authSlice);
    const {products, isLoading, error, selectedSort, page,size} = useSelector((state: RootState) => state.productsSlice);


    useEffect(() => {
        window.localStorage.setItem("gender", gender);
        dispatch(setProducts(items));
    }, [dispatch, items, gender]);

    useEffect(() => {
        if (user) {
            dispatch(getInventory({gender, page,size}));
        }
    }, [selectedSort, user, page, dispatch,size]);

    return (
        <section className="w-full flex lg:grid lg:grid-cols-5 lg:gap-32 pt-5 flex-row">
            <div className="lg:block hidden">
                <ProductsFilter gender={gender}/>
            </div>
            <div className="col-span-4 w-full relative">
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
                <div className="w-full flex flex-col justify-between items-center">
                    <ul className="flex flex-row gap-5 mb-10 md:gap-10 flex-wrap mt-5 w-full justify-center items-center md:justify-start">
                        {products.map((item) => (
                            <li key={item.itemId}>
                                <ItemCard item={item}/>
                            </li>
                        ))}
                    </ul>
                    <Pagination count={10} variant="outlined" shape="rounded"
                                onChange={(event, value) => dispatch(setPage(value))}
                    />
                </div>
                {(products.length === 0 && !isLoading) && <EmptyState heading={"Products Not Available!"}/>}
                {isLoading && <ComponentLoader/>}
                {error && <EmptyState heading={"An error occurred!"} subHeading={error}/>}
            </div>
        </section>
    );
};

export default Products;
