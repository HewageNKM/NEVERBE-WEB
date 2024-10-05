import React from 'react';
import {getHotsProducts} from "@/firebase/serviceAPI";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import {Item} from "@/interfaces";

const HotProducts = async () => {
    let items:Item[] = []
    try {
        items = await getHotsProducts();
    }catch (e){
        console.log(e);
    }
    return (
        <section className="w-full mt-10">
            <div className="px-8 py-8">
                <h1 className="font-bold text-4xl">Hot Products</h1>

                <div className="mt-8 w-full flex justify-center items-center">
                    <ul className="flex flex-row flex-wrap gap-4">
                        <li>
                            {items.map((item, index) => (
                                <ItemCard item={item} flag={"hot"} key={index}/>
                            ))}
                            {items.length === 0 && (
                                <EmptyState message="No hot products available !"/>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default HotProducts;