import React from 'react';
import ProductHero from "@/app/collections/products/[itemId]/components/ProductHero";
import {notFound} from "next/navigation";
import {Item} from "@/interfaces";
import {Metadata} from "next";
import SimilarProducts from "@/app/collections/products/[itemId]/components/SimilarProducts";
import { getItemById, getSimilarItems } from '@/services/ProductService';

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

    const title = `${item.name}`
    const description = item.description ? item.description : `Discover ${item.name} at NEVERBE. Shop now!`

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
            <div className="md:px-8 px-4 py-4">
                <ProductHero item={item}/>
                <SimilarProducts items={similarItems}/>
            </div>
        </main>
    );
};
export const dynamic = 'force-dynamic';
export default Page;
