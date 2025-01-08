import React from 'react';
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

const SimilarProducts = ({ items }: { items: Item[] }) => {
    return (
        <section className="w-full my-10">
            <div className="w-full">
                <div>
                    <h2 className="md:text-2xl text-xl text-gray-800 tracking-wide font-bold">Similar Products</h2>
                </div>
                <div className="my-8 overflow-x-auto hide-scrollbar w-full">
                    {items.length > 0 ? ( // Render items
                        <ul className="flex flex-row flex-wrap gap-3 md:gap-6 lg:gap-10 mb-10 w-full">
                            {items.map((item: Item) => (
                                <li key={item.itemId}>
                                    <ItemCard item={item} />
                                </li>
                            ))}
                        </ul>
                    ) : ( // Empty state
                        <EmptyState message="No similar products available!" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default SimilarProducts;
