'use client'
import {CartItem} from "@/interfaces";
import {algoliasearch} from "algoliasearch";

export const generateOrderId = (location: "Store" | "Website"): string => {
    // Short timestamp based on seconds
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-6);

    // Add location identifier (e.g., "st" for Store, "wb" for Website)
    const locationPart = location === "Store" ? "st" : "wb";

    // Combine parts into a final 12-character order ID
    return `ORD-${locationPart}-${timestamp}`.toLowerCase();
};

export const calculateSubTotal = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
}

export const getAlgoliaClient = () => {
    const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

    return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
}
