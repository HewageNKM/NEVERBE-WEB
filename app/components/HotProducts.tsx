import React from 'react';
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { Item } from "@/interfaces";
import {getHotProducts} from "@/firebase/firebaseAdmin";

const HotProducts = async () => {
    let items: Item[] = [];
    let error: string | null = null;
    let loading = true; // Track loading state

    try {
        items = await getHotProducts();
    } catch (e) {
        console.error(e);
        error = "Failed to load hot products"; // Set error message
    } finally {
        loading = false; // Set loading to false after data fetching
    }

    return (
        <section className="w-full mt-10">
            <div className="px-8 py-8">
                <div>
                    <h2 className="text-4xl"><strong>Hot Products</strong></h2>
                    <h3 className="md:text-2xl text-xl text-primary mt-2">Check out our best-selling products</h3>
                </div>
                <div className="mt-8 w-full flex justify-center items-center">
                    {loading ? ( // Loading state
                        <p className="text-lg">Loading hot products...</p>
                    ) : error ? ( // Error state
                        <p className="text-red-500">{error}</p>
                    ) : items.length > 0 ? ( // Render items
                        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full">
                            {items.map((item: Item) => (
                                <li key={item.itemId}>
                                    <ItemCard item={item} flag={"hot"} />
                                </li>
                            ))}
                        </ul>
                    ) : ( // Empty state
                        <EmptyState message="No hot products available!" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default HotProducts;
