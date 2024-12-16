import React from 'react';
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import {Item} from '@/interfaces';

const Products = ({items}: { items: Item[] }) => {
    return (
        <section className="w-full mt-20 mb-10">
            <ul className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-3 lg:grid-cols-7 w-full">
                {items.map((item) => (
                    <li key={item.itemId}>
                        <ItemCard item={item} flag={""}/>
                    </li>
                ))}
            </ul>
            {items.length === 0 && <EmptyState message={"Products Not Available!"}/>}
        </section>
    );
};

export default Products;
