'use client'
import {CartItem} from "@/interfaces";

export const calculateShipping = (cartItems: CartItem[]) => {
    if (cartItems.length === 0) {
        return 0;
    }

    // Constants for shipping cost
    const firstKgCost = 350;
    const additionalKgCost = 150;

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

    // A random 3-character alphanumeric string for extra randomness
    const randomPart = Math.random().toString(36).substring(2, 2).toLowerCase();

    // Add location identifier (e.g., "st" for Store, "wb" for Website)
    const locationPart = location === "Store" ? "st" : "wb";

    // Combine parts into a final 12-character order ID
    return `${locationPart}${timestamp}${randomPart}`.toLowerCase();
};

