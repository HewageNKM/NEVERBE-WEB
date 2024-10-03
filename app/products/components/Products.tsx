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
        <div className="flex flex-row flex-wrap gap-5 mt-20 mb-10">
            {items.map((item, index) => (
                <ItemCard item={item} flag={""} key={item.itemId}/>
            ))}
            {items.length === 0 && <EmptyState message={"Products Not Available!"}/>}
        </div>
    );
};

export default Products;