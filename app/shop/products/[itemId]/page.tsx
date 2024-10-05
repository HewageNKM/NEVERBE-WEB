import React from 'react';
import {getItemById} from '@/firebase/serviceAPI';
import {SizeImage} from "@/assets/images";
import ProductHero from "@/app/shop/products/[itemId]/components/ProductHero";
import SizeChart from "@/app/shop/products/[itemId]/components/SizeChart";
import {notFound} from "next/navigation";
import {Item} from "@/interfaces";

export const metadata = {
    title: "Product Portfolio",
    twitter:{
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Product Portfolio",
        description: "NEVERBE Product Portfolio",
    },
    openGraph: {
        title: "Product Portfolio",
        description: "NEVERBE Product Portfolio",
        url: "https://neverbe.lk/shop/products/[itemId]",
        type: "website",
        images: [
            {
                url: "https://neverbe.lk/api/og",
                width: 260,
                height: 260,
                alt: "NEVERBE_Logo",
            },
        ],
    }
};

const Page = async ({params}: { params: { itemId: string } }) => {
    //@ts-ignore
    let item:Item = null;

    try {
        item = await getItemById(params.itemId);
    }catch (e){
        console.log(e);
    }

    if(!item) return notFound();

    return (
        <main className="w-full lg:mt-32 md:mt-20 mt-10">
            <div className="px-8 py-4">
                <ProductHero item={item}/>
                <SizeChart image={SizeImage}/>
            </div>
        </main>
    );
};

export default Page;