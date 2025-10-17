// app/checkout/success/page.tsx
import React from "react";
import { redirect, notFound } from "next/navigation";
import SuccessPageClient from "./components/SuccessPageClient";
import { Metadata } from "next";
import { getOrderByIdForInvoice } from "@/services/OrderService";

export const metadata: Metadata = {
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
    const order = await getOrderByIdForInvoice(orderId);
    if (!order) return redirect("/checkout/fail");

    console.log(order);

    return <SuccessPageClient order={order} expired={order.expired} />;
  } catch (error) {
    console.error("Error fetching order:", error);
    return redirect("/checkout/fail");
  }
}
