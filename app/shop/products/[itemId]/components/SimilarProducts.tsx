import React from 'react';
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

const SimilarProducts = ({ items }: { items: Item[] }) => {
    return (
        <section className="w-full mt-10">
            <div className="px-8 py-8">
                <div>
                    <h2 className="text-4xl font-bold">Similar Products</h2>
                </div>
                <div className="mt-8 overflow-x-auto hide-scrollbar">
                    {items.length > 0 ? ( // Render items
                        <ul className="flex gap-4">
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
