import React from 'react';
import Products from "@/app/shop/products/components/Products";
import { Item } from "@/interfaces";
import { Metadata } from "next";
import SortingOptions from "@/app/shop/products/manufacturers/[manufacturerName]/components/SortingOptions";
import { getItemsByTwoField } from "@/firebase/firebaseAdmin";
import EmptyState from "@/components/EmptyState";

export async function generateMetadata({ params }: { params: { manufacturerName: string; brandName: string } }): Promise<Metadata> {
    const title = `${params.manufacturerName.toUpperCase().replace("%20"," ")} | ${params.brandName.toUpperCase().replace("%20"," ")}`;
    const description = `Discover the latest products by ${params.brandName} from ${params.manufacturerName} at NEVERBE. Shop now for quality items and special offers.`;

    return {
        title,
        description,
        keywords: `${params.manufacturerName.replace("%20"," ")}, ${params.brandName.replace("%20"," ")}, NEVERBE, online shopping, products`,
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
            url: `https://neverbe.lk/shop/products/manufacturers/${params.manufacturerName.replace("%20"," ")}/${params.brandName.replace("%20"," ")}`,
            type: "website",
            images: [
                {
                    url: "https://neverbe.lk/api/og",
                    width: 260,
                    height: 260,
                    alt: "NEVERBE Logo",
                },
            ],
        },
    };
}

const Page = async ({ params }: { params: { manufacturerName: string; brandName: string } }) => {
    let items: Item[] = [];

    try {
        items = await getItemsByTwoField(params.manufacturerName.replace("%20"," "), params.brandName.replace("%20"," "), "manufacturer", "brand");
    } catch (e) {
        console.error("Error fetching items:", e);
    }

    return (
        <main className="w-full relative lg:mt-32 md:mt-20 mt-10 overflow-hidden">
            <section className="px-8 py-6">
                <h1 className="md:text-3xl text-lg font-bold uppercase tracking-wider mt-10 text-gray-800">
                    {params.manufacturerName.replace("%20"," ")} &gt; {params.brandName.replace("%20"," ")} ({items.length})
                </h1>
                <div className="w-full">
                    <SortingOptions />
                    {items.length > 0 ? (
                        <Products items={items} />
                    ) : (
                        <div className="mt-10">
                            <EmptyState message={`No products found for ${params.manufacturerName.replace("%20"," ").toUpperCase()} ${params.brandName}.`} />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Page;
