import React from 'react';
import Link from "next/link";
import {getInventory} from "@/firebase/serviceAPI";
import ItemCard from "@/components/ItemCard";

const Page = async () => {
    const items = await getInventory();
    return (
        <div className="w-full">
            <div className="px-8 py-4">
                <h1 className="md:text-4xl text-2xl font-bold tracking-wider mt-10">Products</h1>
                <div className="flex flex-row items-center text-blue-500 text-lg">
                    <Link href={"/"}>Home</Link>
                    <Link href={"/products"}>/Products</Link>
                </div>

                <div className="flex flex-row flex-wrap gap-10 mt-20">
                    {items.map((item, index) => (
                        <ItemCard item={item} flag={""} key={item.itemId}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;