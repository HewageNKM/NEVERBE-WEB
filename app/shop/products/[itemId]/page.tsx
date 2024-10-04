import React from 'react';
import {getItemById} from '@/firebase/serviceAPI';
import {SizeImage} from "@/assets/images";
import ProductHero from "@/app/shop/products/[itemId]/components/ProductHero";
import SizeChart from "@/app/shop/products/[itemId]/components/SizeChart";
import {notFound} from "next/navigation";

export const metadata = {
    title: "Product Portfolio",
};
const Page = async ({params}: { params: { itemId: string } }) => {
    const item = await getItemById(params.itemId);

    if(!item) return notFound();
    return (
        <div className="w-full lg:mt-32 md:mt-20">
            <div className="px-8 py-4">
                <ProductHero item={item}/>
                <SizeChart image={SizeImage}/>
            </div>
        </div>
    );
};

export default Page;