'use client'
import {CartItem} from "@/interfaces";
import {algoliasearch} from "algoliasearch";

export const generateOrderId = (): string => {
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4); // Last 4 digits of timestamp
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString().slice(-2); // 2 random digits
    return `${timestamp}${randomPart}`.toLowerCase();
};

export const calculateSubTotal = (items: CartItem[]) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const totalDiscount = items.reduce((acc, item) => acc + item.discount, 0)
    return total - totalDiscount;
}

export const getAlgoliaClient = () => {
    const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

    return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
}
