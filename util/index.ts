'use client'
import { SHIPPING_FLAT_RATE_1, SHIPPING_FLAT_RATE_2 } from "@/constants";
import {CartItem} from "@/interfaces";
import {algoliasearch} from "algoliasearch";


export const generateOrderId = (): string => {
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4); // Last 4 digits of timestamp
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString().slice(-2); // 2 random digits
    return `${timestamp}${randomPart}`.toLowerCase();
};


export const calculateTotalItems = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
}

export const calculateShippingCost = (items: CartItem[]) => {
    const totalItems = calculateTotalItems(items);
    if (totalItems > 1) {
        return SHIPPING_FLAT_RATE_2;
    } else if(totalItems === 0){
        return 0;
    }
    return SHIPPING_FLAT_RATE_1;
}

export const calculateTotalDiscount = (items: CartItem[])=>{
    return items.reduce((acc, item) => acc + ((Math.round((item.price * (item.discount / 100)) / 10) * 10) * item.quantity), 0);
}

export const calculateTotal = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
}

export const calculateSubTotal = (items: CartItem[]) => {
    return calculateTotal(items) - calculateTotalDiscount(items) + calculateShippingCost(items);
}

export const getAlgoliaClient = () => {
    const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

    return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
}
