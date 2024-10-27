import React from 'react';
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { getRecentItems } from "@/firebase/firebaseAdmin";

const NewArrivals = async ({arrivals: arrivals}:{arrivals:Item[]}) => {

    return (
        <section className="w-full mt-10">
            <div className="px-8 py-4 w-full">
                <div>
                    <h2 className="text-4xl"><strong>New Arrivals</strong></h2>
                    <h3 className="md:text-2xl text-xl text-primary mt-2">Check out our latest products</h3>
                </div>
                <div className="mt-10">
                    {arrivals.length > 0 ? ( // Render items
                        <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 w-full">
                            {arrivals.map((item: Item) => (
                                <li key={item.itemId}>
                                    <ItemCard item={item} flag="new" />
                                </li>
                            ))}
                        </ul>
                    ) : ( // Empty state
                        <EmptyState message="No new arrivals" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
