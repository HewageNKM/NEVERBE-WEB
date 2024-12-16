import React from 'react';
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

const SimilarProducts = ({ items }: { items: Item[] }) => {
    return (
        <section className="w-full mt-10">
            <div>
                <div>
                    <h2 className="md:text-4xl text-2xl font-bold">Similar Products</h2>
                </div>
                <div className="my-8 overflow-x-auto hide-scrollbar">
                    {items.length > 0 ? ( // Render items
                        <ul className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-3 lg:grid-cols-5 w-full">
                            {items.map((item: Item) => (
                                <li key={item.itemId} className="flex-shrink-0 w-60">
                                    <ItemCard item={item} flag={"hot"} />
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
