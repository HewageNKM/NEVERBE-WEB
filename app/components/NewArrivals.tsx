import React from 'react';
import {getInventoryByRecent} from "@/firebase/serviceAPI";
import {Item} from "@/interfaces";
import ItemCard from "@/components/ItemCard";

const NewArrivals = async () => {
    const items:Item[] = await getInventoryByRecent();
    return (
        <div>
            <div className="px-8 py-4">
                <div>
                    <h1 className="font-bold text-4xl">New Arrivals</h1>
                </div>
                <div className="mt-5">
                    {items.map((item: Item) => (
                           <ItemCard item={item} key={item.itemId} flag="new"/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewArrivals;