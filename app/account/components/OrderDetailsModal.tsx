"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoClose,
  IoCloudDownloadOutline,
  IoCubeOutline,
  IoLocationOutline,
  IoCardOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { toSafeLocaleString } from "@/actions/utilAction";
import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import { Order } from "@/interfaces/Order";
import { BusinessInfo } from "@/config/BusinessInfo";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
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
    paymentStatus,
    shippingFee,
    fee,
    discount,
  } = order;

  // Calculation Logic
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemsDiscount = items.reduce(
    (sum, item) => sum + (item.discount || 0),
    0,
  );
  const totalDiscount = itemsDiscount + (discount || 0);
  const total = subtotal - totalDiscount + (shippingFee || 0) + (fee || 0);

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    // 1. Header & Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(BusinessInfo.name, 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(BusinessInfo.legalName, 14, 26);
    doc.text(`${BusinessInfo.addressLine1}, ${BusinessInfo.city}`, 14, 31);
    doc.text(`${BusinessInfo.email} | ${BusinessInfo.website}`, 14, 36);
    doc.text(`Tel: ${BusinessInfo.phone}`, 14, 41);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("INVOICE", 150, 20, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: #${orderId}`, 150, 26, { align: "right" });
    doc.text(`Date: ${toSafeLocaleString(createdAt)}`, 150, 31, {
      align: "right",
    });
    doc.text(`Status: ${status}`, 150, 36, { align: "right" });

    // 2. Customer & Shipping details
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 14, 52);
    doc.setFont("helvetica", "normal");
    doc.text(customer.name, 14, 57);
    doc.text(customer.address || "", 14, 62);
    doc.text(customer.city || "", 14, 67);
    doc.text(`Phone: +${customer.phone}`, 14, 72);

    doc.setFont("helvetica", "bold");
    doc.text("Shipped To:", 100, 52);
    doc.setFont("helvetica", "normal");
    doc.text(customer.shippingName || customer.name, 100, 57);
    doc.text(customer.shippingAddress || customer.address, 100, 62);
    doc.text(customer.shippingCity || customer.city, 100, 67);
    doc.text(`Phone: +${customer.shippingPhone || customer.phone}`, 100, 72);

    // 3. Items Table
    const tableColumn = [
      "Item Description",
      "Size",
      "Qty",
      "Unit Price",
      "Discount",
      "Total",
    ];
    const tableRows = items.map((item) => [
      item.name,
      item.size || "-",
      item.quantity.toString(),
      `Rs. ${item.price.toLocaleString()}`,
      `Rs. ${(item.discount || 0).toLocaleString()}`,
      `Rs. ${(item.price * item.quantity - (item.discount || 0)).toLocaleString()}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: "striped",
      headStyles: { fillColor: [46, 158, 91] }, // NEVERBE green
      styles: { fontSize: 9 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // 4. Summary Totals
    doc.setFontSize(10);
    doc.text("Subtotal:", 130, finalY);
    doc.text(`Rs. ${subtotal.toLocaleString()}`, 180, finalY, {
      align: "right",
    });

    if (totalDiscount > 0) {
      doc.setTextColor(46, 158, 91);
      doc.text("Discount:", 130, finalY + 6);
      doc.text(`- Rs. ${totalDiscount.toLocaleString()}`, 180, finalY + 6, {
        align: "right",
      });
      doc.setTextColor(0);
    }

    doc.text("Shipping:", 130, finalY + (totalDiscount > 0 ? 12 : 6));
    doc.text(
      `Rs. ${(shippingFee || 0).toLocaleString()}`,
      180,
      finalY + (totalDiscount > 0 ? 12 : 6),
      { align: "right" },
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const finalTotalY = finalY + (totalDiscount > 0 ? 20 : 14);
    doc.text("Total:", 130, finalTotalY);
    doc.text(`Rs. ${total.toLocaleString()}`, 180, finalTotalY, {
      align: "right",
    });

    // 5. Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for shopping with NEVERBE!", 105, 280, {
      align: "center",
    });

    doc.save(`Neverbe-Invoice-${orderId}.pdf`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6">
        {/* Soft Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl border border-zinc-100 flex flex-col"
        >
          {/* HEADER */}
          <div className="sticky top-0 bg-white border-b border-default p-6 md:p-8 flex items-center justify-between z-20">
            <div>
              <h2 className="text-2xl font-display font-black uppercase tracking-tighter text-black leading-none">
                Order Details
              </h2>
              <p className="text-[11px] text-zinc-400 font-bold mt-2 uppercase tracking-widest">
                Reference: #{orderId}{" "}
                <span className="mx-2 text-zinc-200">|</span>{" "}
                {toSafeLocaleString(createdAt)}
              </p>
            </div>
            <Button
              type="text"
              icon={<IoClose size={22} />}
              onClick={onClose}
              className="p-3 bg-zinc-50 hover:bg-zinc-100 text-black transition-all rounded-full h-auto"
            />
          </div>

          <div className="p-6 md:p-10 overflow-y-auto hide-scrollbar space-y-10">
            {/* STATUS & ACTIONS */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-4xl border border-default">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#2e9e5b] text-white rounded-2xl shadow-lg shadow-[#2e9e5b]/20">
                  <IoCubeOutline size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                    Current Status
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="font-display font-black text-xl uppercase tracking-tighter text-[#2e9e5b]">
                      {status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleDownloadInvoice}
                  className="flex items-center gap-2 px-6 py-4 bg-white text-black border border-zinc-200 hover:border-black transition-all text-xs! font-black! uppercase! tracking-widest! rounded-full shadow-sm h-auto"
                >
                  <IoCloudDownloadOutline size={18} />
                  Download Invoice
                </Button>
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                Purchased Items ({items.length})
              </h3>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-6 p-4 bg-white rounded-3xl border border-default hover:border-[#2e9e5b] transition-all group"
                  >
                    <div className="w-20 h-20 bg-white shrink-0 rounded-2xl overflow-hidden border border-default p-1">
                      <Image
                        width={80}
                        height={80}
                        src={
                          item.thumbnail || "https://placehold.co/100?text=GEAR"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-display font-black uppercase tracking-tighter text-black text-lg leading-tight">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">
                              Size:{" "}
                              <span className="text-black">{item.size}</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">
                              Qty:{" "}
                              <span className="text-black">
                                {item.quantity}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-black text-black">
                            Rs. {item.price.toLocaleString()}
                          </p>
                          {(item.discount || 0) > 0 && (
                            <p className="text-[10px] font-bold text-[#2e9e5b] uppercase tracking-tighter">
                              - Rs. {(item.discount || 0).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERY & PAYMENT GRID */}
            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-zinc-100">
              <div className="space-y-10">
                <div className="group">
                  <div className="flex items-center gap-3 mb-5">
                    <IoLocationOutline size={20} className="text-[#2e9e5b]" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                      Shipping Details
                    </h3>
                  </div>
                  <address className="not-text-sm text-zinc-500 font-medium leading-relaxed pl-8 border-l-2 border-default group-hover:border-[#2e9e5b] transition-colors">
                    <p className="text-black font-black uppercase tracking-tighter text-base">
                      {customer.shippingName || customer.name}
                    </p>
                    <p className="mt-1">
                      {customer.shippingAddress || customer.address}
                    </p>
                    <p>{customer.shippingCity || customer.city}</p>
                    <p className="text-[#2e9e5b] font-black mt-3">
                      +{customer.shippingPhone || customer.phone}
                    </p>
                  </address>
                </div>

                {customer.address && (
                  <div className="group">
                    <div className="flex items-center gap-3 mb-5">
                      <IoLocationOutline size={20} className="text-[#2e9e5b]" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                        Billing Details
                      </h3>
                    </div>
                    <address className="not-text-sm text-zinc-500 font-medium leading-relaxed pl-8 border-l-2 border-default group-hover:border-[#2e9e5b] transition-colors">
                      <p className="text-black font-black uppercase tracking-tighter text-base">
                        {customer.name}
                      </p>
                      <p className="mt-1">{customer.address}</p>
                      <p>{customer.city}</p>
                      <p className="text-[#2e9e5b] font-black mt-3">
                        +{customer.phone}
                      </p>
                    </address>
                  </div>
                )}

                <div className="group">
                  <div className="flex items-center gap-3 mb-5">
                    <IoCardOutline size={20} className="text-[#2e9e5b]" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
                      Payment Method
                    </h3>
                  </div>
                  <div className="pl-8 border-l-2 border-zinc-100 group-hover:border-[#2e9e5b] transition-colors">
                    <p className="text-sm font-bold text-black uppercase tracking-widest">
                      {paymentMethod}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2e9e5b] mt-1">
                      Status: {paymentStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-default flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#2e9e5b]">
                    <span>Subtotal</span>
                    <span className="text-black">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#2e9e5b]">
                      <span>Discount</span>
                      <span>- Rs. {totalDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#2e9e5b]/40">
                    <span>Shipping</span>
                    <span className="text-black">
                      Rs. {(shippingFee || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-default">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2e9e5b] block mb-2">
                        Order Total
                      </span>
                      <div className="flex items-center gap-2">
                        <IoCheckmarkCircle className="text-[#2e9e5b]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#2e9e5b]">
                          Payment Verified
                        </span>
                      </div>
                    </div>
                    <span className="text-4xl font-display font-black text-black tracking-tighter">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-default text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">
              Neverbe Member Exclusives
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
