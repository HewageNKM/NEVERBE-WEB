import React from 'react';
import {getInventoryByRecent} from "@/firebase/serviceAPI";
import {Item} from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

const NewArrivals = async () => {
    let items: Item[] = [];

    try {
         items = await getInventoryByRecent();
    } catch (e) {
        console.log(e);
    }

    return (
        <section className="w-full mt-10">
            <div className="px-8 py-4 w-full">
                <div>
                    <h1 className="font-bold text-4xl">New Arrivals</h1>
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