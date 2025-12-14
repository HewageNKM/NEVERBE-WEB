"use client";
import { SHIPPING_FLAT_RATE_1, SHIPPING_FLAT_RATE_2 } from "@/constants";
import { BagItem } from "@/interfaces/BagItem";
import { algoliasearch } from "algoliasearch";

export const generateOrderId = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randPart = Math.floor(100000 + Math.random() * 900000);
  return `${datePart}${randPart}`;
};

export const calculateTotalItems = (items: BagItem[]) => {
  return items.reduce((acc, item) => acc + item.quantity, 0);
};

export const calculateShippingCost = (items: BagItem[]) => {
  const totalItems = calculateTotalItems(items);
  if (totalItems > 1) {
    return SHIPPING_FLAT_RATE_2;
  } else if (totalItems === 0) {
    return 0;
  }
  return SHIPPING_FLAT_RATE_1;
};

export const calculateTotalDiscount = (items: BagItem[]) => {
  return items.reduce((acc, item) => acc + item.discount, 0);
};

export const calculateTotal = (items: BagItem[]) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const calculateFee = (fee: number, items: BagItem[]) => {
  return parseFloat((calculateTotal(items) * (fee / 100)).toFixed(2));
};

export const calculateTransactionFeeCharge = (
  items: BagItem[],
  fee: number
) => {
  const total =
    calculateTotal(items) -
    calculateTotalDiscount(items) +
    calculateFee(fee, items) +
    calculateShippingCost(items);
  const transactionFee = (total * (fee / 100)).toFixed(2);
  return parseFloat(transactionFee);
};

export const calculateSubTotal = (items: BagItem[], fee: number) => {
  return (
    calculateTotal(items) -
    calculateTotalDiscount(items) +
    calculateShippingCost(items) +
    calculateFee(fee, items)
  );
};

export const getAlgoliaClient = () => {
  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

  return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY);
};
