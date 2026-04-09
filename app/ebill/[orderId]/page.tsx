import React from "react";
import axiosInstance from "@/actions/axiosInstance";
import { formatCurrency } from "@/utils/formatting";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import EBillDownloadButton from "../components/EBillDownloadButton";
import { BusinessInfo } from "@/config/BusinessInfo";

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
    : new Date(order.createdAt); // Fallback if it's already a date string from repository

  const subtotal = order.items?.reduce(
    (sum: number, item: any) => sum + (item.price - (item.discount || 0)) * item.quantity,
    0,
  ) || 0;
  
  const couponDiscountSum = order.couponDiscount || order.discount || 0;
  const promotionDiscountSum = order.promotionDiscount || 0;
  const total = subtotal - (couponDiscountSum + promotionDiscountSum) + (order.shippingFee || 0) + (order.fee || 0);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-primary-dark">
      {/* HEADER SECTION */}
      <div className="w-full border-b border-default bg-surface-1 p-6 md:p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none">
              Electronic Receipt
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest text-muted">
              <span>Ref: #{order.orderId?.toUpperCase()}</span>
              <span className="hidden sm:inline">|</span>
              <span>Issued: {format(orderDate, "MMM dd, yyyy h:mm a")}</span>
            </div>
          </div>
          <EBillDownloadButton order={order} />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex-1 w-full p-6 md:p-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20">
          
          {/* LEFT: INVOICE DETAILS */}
          <div className="space-y-12">
            {/* BUSINESS INFO */}
            <div className="grid sm:grid-cols-2 gap-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">From</p>
                <div className="text-sm font-medium leading-relaxed">
                  <p className="text-lg font-black uppercase tracking-tight">{BusinessInfo.name}</p>
                  <p>{BusinessInfo.addressLine1}</p>
                  <p>{BusinessInfo.city}, Sri Lanka</p>
                  <p>{BusinessInfo.phone}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Billed To</p>
                {order.customer ? (
                  <div className="text-sm font-medium leading-relaxed">
                    <p className="text-lg font-black uppercase tracking-tight">
                      {order.customer.name || "Valued Customer"}
                    </p>
                    {order.customer.address && <p>{order.customer.address}</p>}
                    {order.customer.city && <p>{order.customer.city}</p>}
                    <p className="text-accent font-black">{order.customer.phone}</p>
                  </div>
                ) : (
                  <p className="text-lg font-black uppercase tracking-tight italic text-muted">Walk-in Customer</p>
                )}
              </div>
            </div>

            {/* ITEMS TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary-dark">
                    <th className="py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted">Description</th>
                    <th className="py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted text-center">Size</th>
                    <th className="py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted text-center">Qty</th>
                    <th className="py-4 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted text-right">Unit Price</th>
                    <th className="py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {order.items?.map((item: any, idx: number) => {
                    const netPrice = item.price - (item.discount || 0);
                    return (
                      <tr key={idx} className="group hover:bg-surface-1 transition-colors">
                        <td className="py-6 pr-4">
                          <p className="font-display font-black uppercase tracking-tight text-lg">{item.name}</p>
                          {item.variantName && (
                            <p className="text-[10px] font-bold uppercase text-muted tracking-widest mt-1">
                              {item.variantName}
                            </p>
                          )}
                        </td>
                        <td className="py-6 px-4 text-center font-bold text-sm">{item.size || "-"}</td>
                        <td className="py-6 px-4 text-center font-bold text-sm">{item.quantity}</td>
                        <td className="py-6 px-4 text-right">
                          <p className="font-bold text-sm">{formatCurrency(netPrice)}</p>
                          {item.discount > 0 && (
                            <p className="text-[10px] text-accent font-bold uppercase line-through opacity-40">
                              {formatCurrency(item.price)}
                            </p>
                          )}
                        </td>
                        <td className="py-6 text-right font-display font-black text-lg">
                          {formatCurrency(netPrice * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAYMENT CONTEXT */}
            <div className="pt-8 border-t border-default flex flex-wrap gap-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Payment Method</p>
                <p className="text-sm font-black uppercase tracking-widest">{order.paymentMethod || "POS Checkout"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Payment Status</p>
                <p className="text-sm font-black uppercase tracking-widest">{order.paymentStatus || "Complete"}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY CARD */}
          <div className="lg:sticky lg:top-12 h-fit bg-surface-1 p-8 md:p-12 rounded-[3rem] border border-default space-y-10 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted">Financial Summary</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                <span className="text-muted">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {(promotionDiscountSum > 0 || couponDiscountSum > 0) && (
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-accent">
                  <span>Total Discount</span>
                  <span>- {formatCurrency(promotionDiscountSum + couponDiscountSum)}</span>
                </div>
              )}

              {order.shippingFee > 0 && (
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                  <span className="text-muted">Shipping</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
              )}

              {order.fee > 0 && (
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                  <span className="text-muted">Additional Fee</span>
                  <span>{formatCurrency(order.fee)}</span>
                </div>
              )}

              <div className="pt-8 border-t-2 border-primary-dark">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Grand Total Due</span>
                  <p className="text-5xl md:text-6xl font-display font-black tracking-tighter">
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted leading-relaxed">
              <p>Thank you for shopping with NEVERBE.</p>
              <p className="mt-2">This is a system generated electronic receipt.</p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-default p-12 text-center">
        <a 
          href="https://neverbe.lk" 
          className="text-lg font-display font-black uppercase tracking-widest hover:text-accent transition-colors"
        >
          neverbe.lk
        </a>
      </footer>
    </div>
  );
}
