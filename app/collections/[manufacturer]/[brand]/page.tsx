import React from 'react';
import {Item} from "@/interfaces";
import {Metadata} from "next";
import {getItemsByTwoField} from "@/firebase/firebaseAdmin";
import BrandProducts from "@/app/collections/[manufacturer]/[brand]/components/BrandProducts";
import BrandHeader from './components/BrandHeader';

export async function generateMetadata({params}: {
    params: { manufacturer: string; brand: string }
}): Promise<Metadata> {
    const title = `${params.manufacturer.toUpperCase().replace("%20", " ")} | ${params.brand.toUpperCase().replace("%20", " ")}`;
    const description = `Discover the latest products by ${params.brand} from ${params.manufacturer} at NEVERBE. Shop now for quality items and special offers.`;

    return {
        title,
        description,
        keywords: `${params.manufacturer.replace("%20", " ")}, ${params.brand.replace("%20", " ")}, NEVERBE, online shopping, products`,
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
            url: `https://neverbe.lk/collections/${params.manufacturer.replace("%20", " ")}/${params.brand.replace("%20", " ")}`,
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

const Page = async ({params}: { params: { manufacturer: string; brand: string } }) => {
    let items: Item[] = [];
    const brand = params.brand.replace("%20", " ");
    const manufacturer = params.manufacturer.replace("%20", " ");
    try {
        items = await getItemsByTwoField(manufacturer, brand, "manufacturer", "brand",1,20);
    } catch (e) {
        console.error("Error fetching items:", e);
    }

    return (
        <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-hidden">
            <section className="w-full">
                <BrandHeader brand={brand} />
                <BrandProducts items={items} brand={brand} manufacturer={manufacturer}/>
            </section>
        </main>
    );
};

export const dynamic = 'force-dynamic';
export default Page;