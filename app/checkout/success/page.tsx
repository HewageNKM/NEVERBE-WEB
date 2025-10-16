// app/checkout/success/page.tsx
import React from "react";
import { getOrderById } from "@/firebase/firebaseAdmin";
import { notFound } from "next/navigation";
import SuccessPageClient from "./components/SuccessPageClient";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Order Success",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { orderId: string };
}) {
  const orderId = searchParams.orderId;
  if (!orderId) return notFound();

  try {
    const order = await getOrderById(orderId);
    if (!order) return notFound();

    return <SuccessPageClient order={order} />;
  } catch (error) {
    console.error("Error fetching order:", error);
    return notFound();
  }
}
