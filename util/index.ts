'use client'
import {CartItem} from "@/interfaces";
import {algoliasearch} from "algoliasearch";
import {PayHereFee} from "@/constants";

export const calculateShipping = (cartItems: CartItem[]) => {
    if (cartItems.length === 0) {
        return 0;
    }

    // Constants for shipping cost
    const firstKgCost = 450;
    const additionalKgCost = 100;

    // Calculate total weight of all items in the cart in grams based on item type
    let totalWeight = cartItems.reduce((total, item) => {
        const itemWeight = item.type === "accessories" ? 250 : 650; // 250g for accessories, 650g for shoes
        return total + (itemWeight * item.quantity);
    }, 0);

    // Convert total weight to kg
    const totalWeightInKg = totalWeight / 1000;

    // Calculate shipping cost
    let shippingCost = firstKgCost;

    if (totalWeightInKg > 1) {
        const additionalWeight = totalWeightInKg - 1;
        shippingCost += Math.ceil(additionalWeight) * additionalKgCost;
    }

    return shippingCost;
}
export const generateOrderId = (location: "Store" | "Website"): string => {
    // Short timestamp based on seconds
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-6);

    // Add location identifier (e.g., "st" for Store, "wb" for Website)
    const locationPart = location === "Store" ? "st" : "wb";

    // Combine parts into a final 12-character order ID
    return `ORD-${locationPart}-${timestamp}`.toLowerCase();
};
export const calculateFeesAndCharges = (cartItems: CartItem[]) => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = calculateShipping(cartItems);
    return (total * PayHereFee / 100) + shipping;
}
export const calculateSubTotal = (items:CartItem[]) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = calculateShipping(items);
    return (total * PayHereFee / 100) + shipping + total;
}
export const getAlgoliaClient = () => {
    const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

    return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
}
