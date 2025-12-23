"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Order } from "@/interfaces/BagItem";
import { 
  IoClose, 
  IoCloudDownloadOutline, 
  IoCubeOutline, 
  IoLocationOutline, 
  IoCardOutline, 
  IoFlashOutline 
} from "react-icons/io5";
import { toSafeLocaleString } from "@/services/UtilService";
import Image from "next/image";
import Invoice from "@/components/Invoice";
import Link from "next/link";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadInvoice: (order: Order) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const {
    orderId,
    createdAt,
    status,
    items,
    customer,
    paymentMethod,
    shippingFee,
    fee,
    discount,
  } = order;

  // Calculation Logic
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);
  const totalDiscount = itemsDiscount + (discount || 0);
  const total = subtotal - totalDiscount + (shippingFee || 0) + (fee || 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Technical Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-surface w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-[2.5rem] shadow-hover border border-white/10 flex flex-col"
        >
          {/* HEADER: Performance Spec Branding */}
          <div className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-default p-6 md:p-8 flex items-center justify-between z-20">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent italic">
                Deployment Spec
              </span>
              <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-inverse">
                Order Intelligence
              </h2>
              <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-widest">
                ID: #{orderId} • Logged: {toSafeLocaleString(createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-surface-2 hover:bg-dark text-inverse transition-all rounded-full shadow-sm"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="p-6 md:p-8 overflow-y-auto hide-scrollbar space-y-10">
            
            {/* STATUS & QUICK ACTIONS */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-surface-2 p-6 rounded-2xl border border-white/5 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent text-dark rounded-full shadow-custom animate-pulse">
                  <IoCubeOutline size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted">Current Protocol</p>
                  <div className="flex items-center gap-3">
                    <p className="font-display font-black text-lg uppercase italic text-inverse">{status}</p>
                    <Link
                      href={`/checkout/success/${orderId}`}
                      className="text-[10px] font-black uppercase tracking-widest text-accent underline underline-offset-4"
                    >
                      Audit Confirmation
                    </Link>
                  </div>
                </div>
              </div>
              <Invoice
                order={order}
                className="flex items-center gap-2 px-6 py-3 bg-dark text-accent border border-accent/20 hover:bg-accent hover:text-dark transition-all text-xs font-black uppercase italic tracking-widest rounded-full shadow-custom"
                btnText={
                  <>
                    <IoCloudDownloadOutline size={16} />
                    Export Invoice
                  </>
                }
              />
            </div>

            {/* GEAR LOG (Items) */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <IoFlashOutline className="text-accent" />
                <h3 className="text-xs font-black uppercase tracking-widest text-inverse">
                  Gear Deployment ({items.length} Units)
                </h3>
              </div>
              
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-5 p-4 bg-surface-2/50 rounded-2xl border border-white/5 group hover:border-accent/30 transition-colors">
                    <div className="w-20 h-20 bg-surface-3 shrink-0 rounded-xl overflow-hidden border border-default p-1">
                      <Image
                        width={80}
                        height={80}
                        src={item.thumbnail || "https://placehold.co/100?text=GEAR"}
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="truncate">
                          <h4 className="font-display font-black uppercase italic tracking-tighter text-inverse truncate">
                            {item.name}
                          </h4>
                          <div className="flex gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase text-muted tracking-widest">Size: <span className="text-accent">{item.size}</span></span>
                            <span className="text-[10px] font-black uppercase text-muted tracking-widest">Qty: <span className="text-inverse">{item.quantity}</span></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-black italic text-inverse">
                            Rs. {item.price.toLocaleString()}
                          </p>
                          {item.discount > 0 && (
                            <p className="text-[10px] font-black text-accent italic uppercase tracking-tighter">
                              - Rs. {item.discount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGISTICS & FISCAL GRID */}
            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
              {/* Deployment Vectors (Addresses) */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <IoLocationOutline size={18} className="text-accent" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-inverse">Deployment Vector</h3>
                  </div>
                  <address className="not-italic text-sm text-muted font-medium leading-relaxed pl-7 border-l-2 border-accent/20">
                    <p className="text-inverse font-bold uppercase">{customer.shippingName || customer.name}</p>
                    <p className="mt-1">{customer.shippingAddress || customer.address}</p>
                    <p>{customer.shippingCity || customer.city}</p>
                    <p className="text-accent font-black italic tracking-tighter mt-2">{customer.shippingPhone || customer.phone}</p>
                  </address>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <IoCardOutline size={18} className="text-accent" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-inverse">Auth Protocol</h3>
                  </div>
                  <div className="pl-7 border-l-2 border-accent/20">
                    <p className="text-sm text-muted font-bold uppercase tracking-widest">
                      Method: <span className="text-inverse">{paymentMethod}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* FISCAL SUMMARY */}
              <div className="bg-surface-3 p-8 rounded-2xl border border-default flex flex-col justify-between">
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted">
                    <span>Base Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-accent italic">
                      <span>Blueprint Savings</span>
                      <span>- Rs. {totalDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted">
                    <span>Logistics Fee</span>
                    <span>Rs. {(shippingFee || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted italic">Final Total</span>
                    <span className="text-3xl font-display font-black italic text-accent tracking-tighter drop-shadow-[0_0_10px_rgba(151,225,62,0.3)]">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;