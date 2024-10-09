import {CartItem} from "@/interfaces";

export const calculateShipping = (cartItems:CartItem[]) => {
    if (cartItems.length === 0) {
        return 0;
    }
    // Constants for shipping cost
    const firstKgCost = 350;
    const additionalKgCost = 150;

    // Calculate total weight of all items in the cart in grams
    let totalWeight = cartItems.reduce((total, item) => {
        return total + (750 * item.quantity);
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