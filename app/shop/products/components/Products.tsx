"use client";
import React, { useEffect } from 'react';
import ItemCard from "@/components/ItemCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import EmptyState from "@/components/EmptyState";
import { Item } from '@/interfaces';
import { setProducts } from "@/redux/productsSlice/productsSlice";

const Products = ({ items }: { items: Item[] }) => {
    const dispatch: AppDispatch = useDispatch();
    const products = useSelector((state: RootState) => state.productsSlice.products);

    useEffect(() => {
        dispatch(setProducts(items));
    }, [dispatch, items]);

    return (
        <section className="w-full mt-20 mb-10">
            <ul className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-3 lg:grid-cols-7 w-full">
                {products.map((item) => (
                    <li key={item.itemId}>
                    <ItemCard item={item} flag={""} />
                    </li>
                ))}
            </ul>
            {products.length === 0 && <EmptyState message={"Products Not Available!"} />}
        </section>
    );
};

export default Products;
