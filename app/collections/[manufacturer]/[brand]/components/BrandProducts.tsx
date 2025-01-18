"use client";
import React, {useEffect} from 'react';
import ItemCard from "@/components/ItemCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import EmptyState from "@/components/EmptyState";
import {Item} from '@/interfaces';
import {IoFilter} from "react-icons/io5";
import {sortingOptions} from "@/constants";
import {FiFilter} from "react-icons/fi";
import ComponentLoader from "@/components/ComponentLoader";
import BrandFilter from "@/app/collections/[manufacturer]/[brand]/components/BrandFilter";
import {getItemsByTwoField, setProducts, setSelectedSort, toggleFilter} from "@/redux/brandSlice/brandSlice";
import Pagination from "@mui/material/Pagination";
import {setPage} from "@/redux/brandSlice/brandSlice";

const BrandProducts = ({items,manufacturer,brand}: { items: Item[],manufacturer:string, brand:string}) => {
    const dispatch: AppDispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.authSlice);
    const {products, selectedSort, isLoading, error,page,size} = useSelector((state: RootState) => state.brandSlice);

    useEffect(() => {
        if(manufacturer && brand){
            window.localStorage.setItem('manufacturer',manufacturer);
            window.localStorage.setItem('brand',brand);

            dispatch(setProducts(items));
        }
    }, [manufacturer,brand]);

    useEffect(() => {
        if(user){
            dispatch(getItemsByTwoField({value1:manufacturer,value2:brand,field1:"manufacturer",field2:"brand",page,size}));
        }
    }, [user,page,size,selectedSort,dispatch]);

    return (
        <section className="w-full flex lg:grid lg:grid-cols-5 lg:gap-32 pt-5 flex-row">
            <div className="lg:block hidden p-2 md:p-4">
                <BrandFilter />
            </div>
            <div className="col-span-4 w-full relative p-4">
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
                {error && <EmptyState heading={"Error Fetching Products!"} subHeading={error}/>}
            </div>
        </section>
    );
};

export default BrandProducts;
