import React from 'react';
import ProductHero from "@/app/shop/products/[itemId]/components/ProductHero";
import SizeChart from "@/app/shop/products/[itemId]/components/SizeChart";
import {notFound} from "next/navigation";
import {Item} from "@/interfaces";
import {getItemById, getSimilarItems} from "@/firebase/firebaseAdmin";
import {Metadata} from "next";
import SimilarProducts from "@/app/shop/products/[itemId]/components/SimilarProducts";

// Dynamically generate metadata
export async function generateMetadata({params}: { params: { itemId: string } }): Promise<Metadata> {
    let item: Item | null = null;

    try {
        item = await getItemById(params.itemId);
    } catch (e) {
        console.log(e);
    }

    if (!item) {
        return {
            title: "Product Not Found",
            description: "This product could not be found.",
        };
    }

    const title = `${item.name} - NEVERBE`;
    const description = `Explore the ${item.name} on NEVERBE.`;

    return {
        title,
        twitter: {
            card: "summary",
            site: "@neverbe",
            creator: "@neverbe",
            title,
            description,
        },
        openGraph: {
            title,
            description,
            type: "website",
            images: [
                {
                    url: "https://neverbe.lk/api/og",
                    width: 260,
                    height: 260,
                    alt: "NEVERBE_Logo",
                },
            ],
        },
    };
}

const Page = async ({params}: { params: { itemId: string } }) => {
    let item: Item | null = null;

    try {
        item = await getItemById(params.itemId);
    } catch (e) {
        console.log(e);
    }

    if (!item) return notFound();

    let similarItems: Item[] = [];

    try {
        similarItems = await getSimilarItems(item.itemId);
    } catch (e) {
        console.error("Error fetching similar items:", e.message);
    }

    return (
        <main className="w-full lg:mt-32 mt-20 md:mt-28 overflow-clip">
            <div className="px-8 py-4">
                <ProductHero item={item}/>
                <SizeChart />
                <SimilarProducts items={similarItems}/>
            </div>
        </main>
    );
};
export const dynamic = 'force-dynamic';
export default Page;
