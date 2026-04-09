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
    : new Date(order.createdAt);

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
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none">
              Electronic Receipt
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted">
              <span>Ref: #{order.orderId?.toUpperCase()}</span>
              <span className="hidden sm:inline">|</span>
              <span>Issued: {format(orderDate, "MMM dd, yyyy h:mm a")}</span>
            </div>
          </div>
          <EBillDownloadButton order={order} />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex-1 w-full p-6 md:p-12 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* TOP INFO: FROM / TO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-b border-default pb-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">From</p>
              <div className="text-sm font-medium leading-relaxed">
                <p className="text-xl font-black uppercase tracking-tight mb-1">{BusinessInfo.name}</p>
                <p className="text-muted">{BusinessInfo.addressLine1}</p>
                <p className="text-muted">{BusinessInfo.city}, Sri Lanka</p>
                <p className="text-accent font-bold mt-2">{BusinessInfo.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Billed To</p>
              {order.customer ? (
                <div className="text-sm font-medium leading-relaxed">
                  <p className="text-xl font-black uppercase tracking-tight mb-1">
                    {order.customer.name || "Valued Customer"}
                  </p>
                  {order.customer.address && <p className="text-muted">{order.customer.address}</p>}
                  {order.customer.city && <p className="text-muted">{order.customer.city}</p>}
                  <p className="text-accent font-bold mt-2">{order.customer.phone}</p>
                </div>
              ) : (
                <p className="text-xl font-black uppercase tracking-tight text-muted">Walk-in Customer</p>
              )}
            </div>
          </div>

          {/* ITEM LIST SECTION */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-8">Statement of Items</h3>
            
            {/* Mobile View: Simplified List */}
            <div className="block sm:hidden space-y-6">
              {order.items?.map((item: any, idx: number) => {
                const netPrice = item.price - (item.discount || 0);
                return (
                  <div key={idx} className="flex justify-between items-start border-b border-default pb-4">
                    <div className="space-y-1">
                      <p className="font-display font-black uppercase tracking-tight text-lg leading-none">{item.name}</p>
                      <p className="text-[10px] font-bold uppercase text-muted tracking-widest">
                        {item.size || "Free Size"} &times; {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-black text-lg">{formatCurrency(netPrice * item.quantity)}</p>
                      <p className="text-[9px] text-muted font-bold uppercase">{formatCurrency(netPrice)} each</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary-dark">
                    <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Description</th>
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Size</th>
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Qty</th>
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Unit Price</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {order.items?.map((item: any, idx: number) => {
                    const netPrice = item.price - (item.discount || 0);
                    return (
                      <tr key={idx} className="group transition-colors">
                        <td className="py-6 pr-4">
                          <p className="font-display font-black uppercase tracking-tight text-lg leading-tight">{item.name}</p>
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
                            <p className="text-[9px] text-accent font-bold uppercase line-through opacity-40">
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
          </div>

          {/* BOTTOM GRID: PAYMENT & SUMMARY */}
          <div className="flex flex-col lg:flex-row gap-16 pt-8 border-t border-default">
            
            {/* PAYMENT CONTEXT */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Payment Method</p>
                  <p className="text-sm font-black uppercase tracking-widest leading-none">{order.paymentMethod || "CASH"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Payment Status</p>
                  <p className="text-sm font-black uppercase tracking-widest leading-none">{order.paymentStatus || "PAID"}</p>
                </div>
              </div>
              <div className="pt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-muted leading-relaxed max-w-xs">
                <p>Thank you for shopping with NEVERBE. This is a system generated receipt.</p>
              </div>
            </div>

            {/* FINANCIAL SUMMARY CARD */}
            <div className="w-full lg:w-[400px] bg-surface-1 p-8 md:p-10 rounded-[2.5rem] border border-default space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted text-center lg:text-left">Financial Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-primary-dark font-black">{formatCurrency(subtotal)}</span>
                </div>
                
                {(promotionDiscountSum > 0 || couponDiscountSum > 0) && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-accent">
                    <span>Total Discount</span>
                    <span className="font-black">- {formatCurrency(promotionDiscountSum + couponDiscountSum)}</span>
                  </div>
                )}

                {order.shippingFee > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted">Shipping</span>
                    <span className="text-primary-dark font-black">{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-primary-dark/20">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent text-center lg:text-left">Grand Total Due</span>
                    <p className="text-[44px] md:text-5xl font-display font-black tracking-tighter text-center lg:text-left leading-none">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-default p-12 text-center bg-white">
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
