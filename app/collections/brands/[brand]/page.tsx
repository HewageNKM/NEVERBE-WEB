import React from 'react';
import {Item} from "@/interfaces";
import {Metadata} from "next";
import BrandProducts from "@/app/collections/brands/[brand]/components/BrandProducts";
import BrandHeader from './components/BrandHeader';
import { getProductsByBrand } from '@/services/ProductService';

export async function generateMetadata({params}: {
    params: {brand: string }
}): Promise<Metadata> {
    const title = `${params.brand.replace("%20", " ")}`;
    const description = `Discover the latest products by ${params.brand} at NEVERBE. Shop now for quality items and special offers.`;

    return {
        title,
        description,
        keywords: `${params.brand.replace("%20", " ")}, NEVERBE, online shopping, products`,
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
            url: `https://neverbe.lk/collections/brands/${params.brand.replace("%20", " ")}`,
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

const Page = async ({params}: { params: {brand: string } }) => {
    let items: Item[] = [];
    const brand = params.brand.replace("%20", " ");
    try {
        items = (await getProductsByBrand(brand,1,20)).dataList;
    } catch (e) {
        console.error("Error fetching items:", e);
    }

    return (
        <main className="w-full relative lg:mt-28 mt-16 mb-5 overflow-hidden">
            <section className="w-full">
                <BrandHeader brand={brand} />
                <BrandProducts items={items } brand={brand}/>
            </section>
        </main>
    );
};

export const dynamic = 'force-dynamic';
export default Page;