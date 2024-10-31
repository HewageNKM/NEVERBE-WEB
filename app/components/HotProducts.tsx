import React from 'react';
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { Item } from "@/interfaces";
import {getHotProducts} from "@/firebase/firebaseAdmin";

const HotProducts = async ({hotItems}:{hotItems:Item[]}) => {

    return (
        <section className="w-full mt-10">
            <div className="px-8 py-8">
                <div>
                    <h2 className="text-4xl"><strong>Hot Products</strong></h2>
                    <h3 className="md:text-2xl text-xl text-primary mt-2">Check out our best-selling products</h3>
                </div>
                <div className="mt-8 w-full flex justify-center items-center">
                    {hotItems.length > 0 ? ( // Render items
                        <ul className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-3 lg:grid-cols-7 w-full">
                            {hotItems.map((item: Item) => (
                                <li key={item.itemId}>
                                    <ItemCard item={item} flag={"hot"} />
                                </li>
                            ))}
                        </ul>
                    ) : ( // Empty state
                        <EmptyState message="No hot products available!" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default HotProducts;
