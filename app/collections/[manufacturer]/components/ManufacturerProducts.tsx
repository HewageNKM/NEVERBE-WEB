"use client";
import React, {useEffect} from 'react';
import ItemCard from "@/components/ItemCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import EmptyState from "@/components/EmptyState";
import {Item} from '@/interfaces';
import {setProducts, setSelectedSort, toggleFilter,getItemsByManufacturer} from "@/redux/manufacturerSlice/manufacturerSlice";
import {IoFilter} from "react-icons/io5";
import {sortingOptions} from "@/constants";
import {FiFilter} from "react-icons/fi";
import ManufacturerFilter from "@/app/collections/[manufacturer]/components/ManufacturerFilter";
import ComponentLoader from "@/components/ComponentLoader";
import Pagination from "@mui/material/Pagination";
import {setPage} from "@/redux/manufacturerSlice/manufacturerSlice";

const Products = ({items, manufacturer}: { items: Item[], manufacturer: string }) => {
    const dispatch: AppDispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.authSlice);
    const {products, selectedSort, isLoading, error,page,size} = useSelector((state: RootState) => state.manufacturerSlice);


    useEffect(() => {
        window.localStorage.setItem("manufacturer", manufacturer);
        dispatch(setProducts(items));
    }, [dispatch, items,manufacturer]);

    useEffect(() => {
        if(user){
            dispatch(getItemsByManufacturer({name:manufacturer,page,size}));
        }
    }, [user,page,selectedSort,dispatch,size]);

    return (
        <section className="w-full flex lg:grid lg:grid-cols-5 lg:gap-32 pt-5 flex-row">
            <div className="lg:block hidden">
                <ManufacturerFilter manufacturer={manufacturer}/>
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
                {error && <EmptyState heading={"Error Fetching Products!"} subHeading={error}/>}
            </div>
        </section>
    );
};

export default Products;
function getInventoryByManufacturer(arg0: { manufacturer: string; page: number; 20: any; }): any {
    throw new Error('Function not implemented.');
}

