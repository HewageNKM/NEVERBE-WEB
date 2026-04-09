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

  const subtotal = order.items?.reduce(
    (sum: number, item: any) => sum + (item.price - (item.discount || 0)) * item.quantity,
    0,
  ) || 0;
  
  const couponDiscountSum = order.couponDiscount || order.discount || 0;
  const promotionDiscountSum = order.promotionDiscount || 0;
  const total = subtotal - (couponDiscountSum + promotionDiscountSum) + (order.shippingFee || 0) + (order.fee || 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="relative bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto hide-scrollbar rounded-[2.5rem] shadow-2xl border border-default flex flex-col">
          {/* HEADER */}
          <div className="sticky top-0 bg-white border-b border-default p-6 md:p-8 flex flex-col md:flex-row items-center justify-between z-20 gap-4">
            <div>
              <h2 className="text-2xl font-display font-black uppercase tracking-tighter text-primary-dark leading-none text-center md:text-left">
                Electronic Receipt
              </h2>
              <p className="text-[11px] text-muted font-bold mt-2 uppercase tracking-widest text-center md:text-left">
                Reference: #{order.orderId?.toUpperCase()} <span className="mx-2 text-muted">|</span>{" "}
                {format(orderDate, "MMM dd, yyyy h:mm a")}
              </p>
            </div>
            {/* Optionally, we could add a Download button here in a client component layer */}
          </div>

          <div className="p-6 md:p-10 space-y-10">
            {/* PRODUCT LIST */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-6">
                Purchased Items ({order.items?.length || 0})
              </h3>

              <div className="space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-3xl border border-default hover:border-accent transition-all group"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0 bg-white shrink-0 rounded-2xl overflow-hidden border border-default p-1">
                      <Image
                        width={96}
                        height={96}
                        src={item.thumbnail || "https://placehold.co/100?text=GEAR"}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="font-display font-black uppercase tracking-tighter text-primary-dark text-lg leading-tight text-center sm:text-left">
                            {item.name}
                          </h4>
                          <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 sm:mt-1">
                            <span className="text-[10px] font-bold uppercase text-muted tracking-widest">
                              Size:{" "}
                              <span className="text-primary-dark">{item.size || "-"}</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase text-muted tracking-widest">
                              Qty:{" "}
                              <span className="text-primary-dark">
                                {item.quantity}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="text-center sm:text-right w-full sm:w-auto">
                          <p className="font-display font-black text-primary-dark whitespace-nowrap">
                            {formatCurrency(item.price - (item.discount || 0))}
                          </p>
                          {((item.discount || 0) > 0) && (
                            <p className="text-[10px] text-accent font-bold uppercase line-through opacity-40">
                              {formatCurrency(item.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-default">
              <div className="space-y-10">
                {order.customer?.name && (
                  <div className="group">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-dark">
                        Billed To
                      </h3>
                    </div>
                    <address className="not-text-sm text-primary-dark font-medium leading-relaxed pl-11 border-l-2 border-default group-hover:border-accent transition-colors">
                      <p className="text-primary-dark font-black uppercase tracking-tighter text-base">
                        {order.customer.name}
                      </p>
                      {order.customer.address && <p className="mt-1">{order.customer.address}</p>}
                      {order.customer.city && <p>{order.customer.city}</p>}
                      <p className="text-accent font-black mt-3">
                        {order.customer.phone}
                      </p>
                    </address>
                  </div>
                )}

                <div className="group">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-dark">
                      Payment Context
                    </h3>
                  </div>
                  <div className="pl-11 border-l-2 border-default group-hover:border-accent transition-colors">
                    <p className="text-sm font-bold text-primary-dark uppercase tracking-widest">
                      {order.paymentMethod || "POS Checkout"}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mt-1">
                      Status: {order.paymentStatus || "Complete"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="bg-surface-1 p-8 rounded-[2.5rem] border border-default flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted">
                    <span>Subtotal</span>
                    <span className="text-primary-dark">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {promotionDiscountSum > 0 && (
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-accent">
                      <span>Auto Discount</span>
                      <span>- {formatCurrency(promotionDiscountSum)}</span>
                    </div>
                  )}
                  {couponDiscountSum > 0 && (
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-accent">
                      <span>Discount</span>
                      <span>- {formatCurrency(couponDiscountSum)}</span>
                    </div>
                  )}
                  {(order.shippingFee || 0) > 0 && (
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-muted">
                      <span>Shipping</span>
                      <span className="text-primary-dark">
                        {formatCurrency(order.shippingFee)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-8 mt-8 border-t border-default">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent block mb-2">
                        Order Total
                      </span>
                    </div>
                    <span className="text-4xl font-display font-black text-primary-dark tracking-tighter">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-default text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted mb-2">
              Thank you for shopping with us!
            </p>
            <a href="https://neverbe.lk" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors">
              neverbe.lk
            </a>
          </div>
      </div>
    </div>
  );
}
