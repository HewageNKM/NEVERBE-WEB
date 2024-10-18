import React from 'react';
import { SizeImage } from "@/assets/images";
import ProductHero from "@/app/shop/products/[itemId]/components/ProductHero";
import SizeChart from "@/app/shop/products/[itemId]/components/SizeChart";
import { notFound } from "next/navigation";
import { Item } from "@/interfaces";
import { getItemById } from "@/firebase/firebaseAdmin";
import { Metadata } from "next";

// Dynamically generate metadata
export async function generateMetadata({ params }: { params: { itemId: string } }): Promise<Metadata> {
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

    const title = `${item.name.toUpperCase()} - NEVERBE`;
    const description = `Explore the ${item.name.toUpperCase()} on NEVERBE.`;

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

const Page = async ({ params }: { params: { itemId: string } }) => {
    let item: Item | null = null;

    try {
        item = await getItemById(params.itemId);
    } catch (e) {
        console.log(e);
    }

    if (!item) return notFound();

    return (
        <main className="w-full lg:mt-24 md:mt-20 mt-10 overflow-clip">
            <div className="px-8 py-4">
                <ProductHero item={item} />
                <SizeChart image={SizeImage} />
            </div>
        </main>
    );
};

export default Page;
