import React from 'react';
import {getItemsByManufacturerAndBrandName} from "@/firebase/serviceAPI";
import Products from "@/app/shop/products/components/Products";
import {Item} from "@/interfaces";

const Page = async ({params}: { params: { manufacturerName: string, brandName: string } }) => {
    let items: Item[] = [];
    try {
        items = await getItemsByManufacturerAndBrandName(params.manufacturerName, params.brandName);
    } catch (e) {
        console.log(e);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl capitalize font-bold tracking-wider mt-10">{params.manufacturerName} &gt; {params.brandName}({items.length})</h1>
                <div className="w-full">
                    <Products items={items}/>
                </div>
            </div>
        </main>
    );
};

export default Page;