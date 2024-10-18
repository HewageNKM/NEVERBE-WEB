'use client'
import {CartItem, Order} from "@/interfaces";
import {getIdToken} from "@/firebase/firebaseClient";
import axios from "axios";

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
export const generateOrderId = (): string => {
    // Generate a random alphanumeric string of 5 characters
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();

    // Get the current timestamp in base36 for compactness
    const timestamp = Date.now().toString(36).toUpperCase();

    // Combine the timestamp and random string for uniqueness
    return `${timestamp}${randomStr}`;
};



export const addNewOrder = async (newOrder: Order,) => {
    const token = await getIdToken();
    return axios({
        method: 'post',
        url: "/api/orders",
        data: JSON.stringify(newOrder),

        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}
