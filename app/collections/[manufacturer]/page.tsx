import React from 'react';
import {Metadata} from "next";
import EmptyState from "@/components/EmptyState";
import ManufacturerHeader from "@/app/collections/[manufacturer]/components/ManufacturerHeader";
import {Item} from "@/interfaces";
import ManufacturerProducts from "@/app/collections/[manufacturer]/components/ManufacturerProducts";
import { getItemsByField } from '@/services/ProductService';

// Dynamically generate metadata
export async function generateMetadata({ params }: { params: { manufacturer: string } }): Promise<Metadata> {
    const title = `${params.manufacturer.replace("%20", " ")}`;
    const description = (() => {
        switch (title.toLowerCase()) {
            case "nike":
                return "Discover Nike collection Jordan, Air Force 1, Air Max, Dunk, SB, Blazer, Cortez, Huarache, Presto, React, Vapormax, Zoom, Yeezy, Off-White, Travis Scott, Fear of God, Sacai, Dior, Stussy, Supreme, Fragment, Comme des Garcons, Undercover, ACRONYM, Travis Scott, Cactus Plant Flea Market, Ambush, Sacai, Off-White, Fear of God, Stussy, Supreme, Fragment, Comme des";
            case "adidas":
                return "Discover Adidas collection Yeezy, Ultraboost, NMD, Superstar, Stan Smith, Gazelle, Samba, Continental, EQT, ZX, Yung, Torsion, Spezial, Campus, Tubular, Futurecraft 4D, Pharrell";
            case "new balance":
                return "Discover New Balance collection 327, 550, 992, 993, 997, 998, 999, 1300, 1500, 1530, 1540, 1600, 1700, 2002, 2006, 2010, 2040, 247";
            case "puma":
                return "Discover Puma collection Suede, Clyde, RS-X, Future Rider, Mirage, Cali, Rider, Cell, Thunder, Sky, Basket, Roma, King, GV, RS-0, RS-100, RS-350, RS-500, RS-1000, RS-2000, RS-X, Inhale, Disc, Blaze, Mostro, Trinomic, Cell, Enzo, Ignite, Tsugi, Jamming, Hybrid, LQDCELL, Nitefox, Mirage, Alteration, Storm, Uproar, Legacy, Ralph Sampson";
            case "luvion vuitton":
                return "Discover Luvion Vuitton like Trainers, Sneakers, Run Away, Frontrow";
            default:
                return `Discover ${title} collection`;
        }
    })();

    return {
        title: title.toUpperCase(),
        description,
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

const Page = async ({params}: { params: { manufacturer: string } }) => {
    let items: Item[] = []
    try {
        items.push(...await getItemsByField(params.manufacturer.replace("%20", " "), 'manufacturer',1,20));
    } catch (e) {
        console.error("Error fetching items:", e);
    }
    return (
        <main className="w-full lg:mt-28 mt-16 mb-5 overflow-clip">
            <div className="w-full">
                <ManufacturerHeader name={params.manufacturer.replace("%20", " ")}/>
                <div className="px-4">
                    {items.length > 0 ? (
                        <ManufacturerProducts items={items} manufacturer={params.manufacturer.replace("%20", " ")}/>
                    ) : (
                        <EmptyState heading="No products available at this time."/>
                    )}
                </div>
            </div>
        </main>
    );
};
export const dynamic = 'force-dynamic';
export default Page;
