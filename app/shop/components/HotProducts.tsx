import React from 'react';
import {getHotsProducts} from "@/firebase/serviceAPI";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";

const HotProducts = async () => {
    const items = await getHotsProducts();
    return (
        <div className="w-full mt-10">
            <div className="px-8 py-8">
                <h1 className="font-bold text-4xl">Hot Products</h1>

                <div>
                    <div className="flex flex-row flex-wrap gap-4 mt-8">
                        {items.map((item, index) => (
                            <ItemCard item={item} flag={"hot"} key={index}/>
                        ))}
                        {items.length === 0 && (
                           <EmptyState message="No hot products available !"/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotProducts;