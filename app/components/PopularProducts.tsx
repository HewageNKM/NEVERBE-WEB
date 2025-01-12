import React from 'react';
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { Item } from "@/interfaces";

const PopularProducts = ({ hotItems }: { hotItems: Item[] }) => {
    return (
        <section className="w-full my-10"
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
                        <ul className="flex flex-row justify-center items-center md:justify-start gap-5 mb-10 md:gap-10 flex-wrap mt-5 w-full">
                            {hotItems.map((item: Item) => (
                                <li key={item.itemId}>
                                    <ItemCard item={item} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState heading="No hot products available!" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default PopularProducts;
