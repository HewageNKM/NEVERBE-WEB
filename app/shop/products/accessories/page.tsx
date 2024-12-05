import React from 'react';
import Products from "@/app/shop/products/components/Products";
import {Item} from "@/interfaces";
import {Metadata} from "next";
import {getItemsByField} from "@/firebase/firebaseAdmin";
import EmptyState from "@/components/EmptyState";
import Options from "@/app/shop/products/components/Options";

export const metadata: Metadata = {}

const Page = async () => {
    let items: Item[] = [];

    try {
        items = await getItemsByField("accessories", "type");
    } catch (e: any) {
        console.error("Error fetching items:", e.message);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-20 overflow-hidden">
            <div className="px-8 py-6">
                <h1 className="md:text-4xl text-3xl capitalize font-bold tracking-wider mt-10 text-gray-800">
                    Accessories ({items.length})
                </h1>
                <div className="w-full mt-4">
                    <Options productType={"accessories"} />
                    {items.length > 0 ? (
                        <Products items={items}/>
                    ) : (
                        <EmptyState message="No products found for accessories"/>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Page;
