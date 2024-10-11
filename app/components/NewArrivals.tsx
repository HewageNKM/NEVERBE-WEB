import React from 'react';
import {Item} from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import {getRecentItems} from "@/firebase/firebaseAdmin";

const NewArrivals = async () => {
    let items: Item[] = [];

    try {
         items = await getRecentItems();
    } catch (e) {
        console.log(e);
    }

    return (
        <section className="w-full mt-10">
            <div className="px-8 py-4 w-full">
                <div>
                    <h2 className="text-4xl"><strong>New Arrivals</strong></h2>
                    <h3 className="md:text-2xl text-xl text-primary mt-2">Check out our latest products</h3>
                </div>
                <ul className="mt-10 flex flex-row flex-wrap lg:gap-20 justify-evenly md:gap-16 gap-10 w-full">
                    {items.map((item: Item) => (
                        <li key={item.itemId}>
                        <ItemCard item={item}  flag="new"/>
                         </li>
                    ))}
                    {items.length === 0 && (<EmptyState message="No new arrivals"/>)}
                </ul>
            </div>
        </section>
    );
};

export default NewArrivals;