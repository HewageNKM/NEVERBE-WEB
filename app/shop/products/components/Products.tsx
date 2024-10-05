"use client"
import React, {useEffect} from 'react';
import ItemCard from "@/components/ItemCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {initializeProducts} from "@/redux/productsSlice/productsSlice";
import EmptyState from "@/components/EmptyState";

const Products = () => {
    const dispatch: AppDispatch = useDispatch();
    const items = useSelector((state: RootState) => state.productsSlice.products);

    useEffect(() => {
        dispatch(initializeProducts());
    }, [dispatch]);

    return (
        <section className="w-full mt-20 mb-10">
            <ul className="flex flex-row flex-wrap justify-evenly lg:gap-20 md:gap-16 gap-10">
                {items.map((item, index) => (
                    <li key={index}>
                        <ItemCard item={item} flag={""} key={item.itemId}/>
                    </li>
                ))}
            </ul>
            {items.length === 0 && <EmptyState message={"Products Not Available!"}/>}
        </section>
    );
};

export default Products;