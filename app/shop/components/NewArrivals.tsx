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
            <div className="px-8 py-4">
                <div>
                    <h1 className="font-bold text-4xl">New Arrivals</h1>
                </div>
                <ul className="mt-10 flex flex-row gap-5 justify-center lg:justify-start lg:items-start items-center">
                    <li>
                        {items.map((item: Item) => (
                            <ItemCard item={item} key={item.itemId} flag="new"/>
                        ))}
                        {items.length === 0 && (<EmptyState message="No new arrivals"/>)}
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default NewArrivals;