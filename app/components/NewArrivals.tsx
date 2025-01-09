import React from 'react';
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { getRecentItems } from "@/firebase/firebaseAdmin";

const NewArrivals = async ({arrivals: arrivals}:{arrivals:Item[]}) => {

    return (
        <section className="w-full my-12">
            <div className="lg:px-24 px-4 w-full">
                <div>
                    <h2 className="md:text-4xl text-2xl"><strong>New Arrivals</strong></h2>
                    <h3 className="md:text-xl text-lg text-primary mt-2">Check out our latest products</h3>
                </div>
                <div className="mt-10">
                    {arrivals.length > 0 ? ( // Render items
                        <ul className="flex flex-row gap-5 mb-10 md:gap-10 flex-wrap mt-5 w-full">
                            {arrivals.map((item: Item) => (
                                <li key={item.itemId}>
                                    <ItemCard item={item} />
                                </li>
                            ))}
                        </ul>
                    ) : ( // Empty state
                        <EmptyState heading="No new arrivals" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
