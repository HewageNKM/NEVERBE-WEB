"use client"
import React, {useEffect} from 'react';
import ItemCard from "@/components/ItemCard";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import EmptyState from "@/components/EmptyState";
import { Item } from '@/interfaces';
import {setProducts} from "@/redux/productsSlice/productsSlice";

const Products = ({items}:{items:Item[]}) => {
    const dispatch: AppDispatch = useDispatch();
    const products = useSelector((state:RootState) => state.productsSlice.products);

    useEffect(() => {
        dispatch(setProducts(items))
    }, [dispatch, items]);

    return (
        <section className="w-full mt-20 mb-10">
            <ul className="flex flex-row flex-wrap justify-evenly lg:gap-20 md:gap-16 gap-10">
                {products.map((item, index) => (
                    <li key={index}>
                        <ItemCard item={item} flag={""} key={item.itemId}/>
                    </li>
                ))}
            </ul>
            {products.length === 0 && <EmptyState message={"Products Not Available!"}/>}
        </section>
    );
};

export default Products;