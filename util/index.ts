"use client";
import { SHIPPING_FLAT_RATE_1, SHIPPING_FLAT_RATE_2 } from "@/constants";
import { CartItem } from "@/interfaces";
import { algoliasearch } from "algoliasearch";

export const generateOrderId = (nodeId: string = "W") => {
  const timePart = Date.now().toString(36).toUpperCase().padStart(7, "0");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timePart}${nodeId}${randomPart}`;
};

export const calculateTotalItems = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.quantity, 0);
};

export const calculateShippingCost = (items: CartItem[]) => {
  const totalItems = calculateTotalItems(items);
  if (totalItems > 1) {
    return SHIPPING_FLAT_RATE_2;
  } else if (totalItems === 0) {
    return 0;
  }
  return SHIPPING_FLAT_RATE_1;
};

export const calculateTotalDiscount = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.discount, 0);
};

export const calculateTotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const calculateSubTotal = (items: CartItem[]) => {
  return (
    calculateTotal(items) -
    calculateTotalDiscount(items) +
    calculateShippingCost(items)
  );
};

export const getAlgoliaClient = () => {
  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

  return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
};
