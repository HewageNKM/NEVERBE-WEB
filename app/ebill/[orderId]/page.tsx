import React from "react";
import axiosInstance from "@/actions/axiosInstance";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatting";
import { notFound } from "next/navigation";
import { format } from "date-fns";

const getOrder = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`/web/orders/${orderId}`);
    return res.data?.data || res.data;
  } catch (error) {
    return null;
  }
};

export default async function EBillPage(props: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await props.params;

  const order = await getOrder(orderId);

  if (!order) {
    return notFound();
  }

  const orderDate = order.createdAt?._seconds
    ? new Date(order.createdAt._seconds * 1000)
    : new Date();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg overflow-hidden flex flex-col pt-8 pb-4">
        {/* Header */}
        <div className="text-center px-6 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-black tracking-tighter mb-1">NEVERBE</h1>
          <p className="text-gray-500 text-sm">ELECTRONIC RECEIPT</p>
        </div>

        {/* Info */}
        <div className="px-8 py-6 flex flex-col gap-2 text-sm border-b border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Order No.</span>
            <span className="font-semibold">{order.orderId.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold">{format(orderDate, "MMM dd, yyyy h:mm a")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold uppercase">{order.paymentMethod || "POS"}</span>
          </div>
        </div>

        {/* Items */}
        <div className="px-8 py-6 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
            Purchased Items
          </h3>
          <div className="flex flex-col gap-4">
            {order.items?.map((item: any, i: number) => {
              const netPrice = (item.price || 0) - (item.discount || 0);
              return (
                <div key={i} className="flex justify-between items-start gap-4">
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-sm text-gray-800 line-clamp-2">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {item.quantity} x {formatCurrency(item.price || 0)}
                      {item.size ? ` / Size: ${item.size}` : ""}
                    </span>
                  </div>
                  <div className="text-right flex flex-col justify-end min-w-[70px]">
                    <span className="font-medium text-sm">
                      {formatCurrency(netPrice * item.quantity)}
                    </span>
                    {(item.discount || 0) > 0 && (
                      <span className="text-[10px] text-red-500 line-through">
                        {formatCurrency((item.price || 0) * item.quantity)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals */}
        <div className="px-8 py-6 bg-gray-50 flex flex-col gap-2 border-b border-gray-200">
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(order.discount)}
              </span>
            </div>
          )}
          {(order.shippingFee || 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-medium">{formatCurrency(order.shippingFee)}</span>
            </div>
          )}
          <div className="flex justify-between items-end mt-2">
            <span className="font-bold text-gray-800 text-lg">Total</span>
            <span className="text-2xl font-black">
              {formatCurrency(order.total || 0)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-8 text-center text-xs text-gray-400">
          <p className="mb-4">Thank you for shopping with us!</p>
          <p>
            Visit <a href="https://neverbe.lk" className="text-black font-semibold hover:underline">neverbe.lk</a> for more styles.
          </p>
        </div>
      </div>
    </div>
  );
}
