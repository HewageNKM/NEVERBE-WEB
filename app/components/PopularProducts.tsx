import React from 'react';
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { Item } from "@/interfaces";

const PopularProducts = ({ hotItems }: { hotItems: Item[] }) => {
    return (
        <section
            className="w-full mt-10"
        >
            <div className="lg:px-24 px-4 py-8">
                <div>
                    <h2 className="md:text-4xl text-2xl font-bold text-gray-800">Popular Products</h2>
                    <h3 className="md:text-xl text-lg text-primary-100 mt-2">
                        Check out our best-selling products
                    </h3>
                </div>
                <div className="mt-8 w-full flex justify-center items-center">
                    {hotItems.length > 0 ? (
                        <ul className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-3 lg:grid-cols-7 w-full">
                            {hotItems.map((item: Item) => (
                                <li key={item.itemId}>
                                    <ItemCard item={item} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState message="No hot products available!" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default PopularProducts;
