"use client";

import React, { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "@/interfaces";
import SuccessAnimationComponents from "./SuccessAnimationComponents";
import { IoDownloadOutline, IoArrowForward } from "react-icons/io5";
import { Logo } from "@/assets/images";

export default function SuccessPageClient({
  order,
  expired,
}: {
  order: Order;
  expired?: boolean;
}) {
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const handleDownloadInvoice = async () => {
    setLoadingInvoice(true);
    try {
      const doc = new jsPDF();

      // --- Logo & Header ---
      const imgWidth = 25;
      const imgHeight = 25;
      const centerX = 105;

      // Black Circle Logo Background
      doc.setFillColor(0, 0, 0);
      doc.circle(centerX, 30, 18, "F");
      doc.addImage(
        Logo.src,
        "PNG",
        centerX - imgWidth / 2,
        30 - imgHeight / 2,
        imgWidth,
        imgHeight
      );

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("INVOICE", 105, 60, { align: "center" });

      // --- Details Section ---
      let yPos = 80;

      // Left: Company
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("NEVERBE", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("330/4/10 New Kandy Road", 20, yPos + 5);
      doc.text("Delgoda, Sri Lanka", 20, yPos + 10);
      doc.text("support@neverbe.lk", 20, yPos + 15);

      // Right: Order Info
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Order Details", 140, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`ID: #${order.orderId}`, 140, yPos + 5);
      doc.text(
        `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
        140,
        yPos + 10
      );
      doc.text(`Payment: ${order.paymentMethod}`, 140, yPos + 15);

      // Divider
      yPos += 25;
      doc.setDrawColor(230);
      doc.line(20, yPos, 190, yPos);

      // --- Item Table ---
      const itemData = order.items.map((item) => [
        item.name,
        item.size || "-",
        item.quantity,
        `Rs. ${item.price.toLocaleString()}`,
        `Rs. ${(item.price * item.quantity).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: yPos + 10,
        head: [["Item", "Size", "Qty", "Price", "Total"]],
        body: itemData,
        theme: "plain",
        headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      // --- Totals ---
      // Calculation logic preserved from your original code
      const subtotal = order.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const totalDiscount = order.items.reduce(
        (sum, i) => sum + (i.discount || 0),
        0
      );
      const grandTotal =
        subtotal - totalDiscount + (order.shippingFee || 0) + (order.fee || 0);

      let finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(10);
      doc.setTextColor(0);

      const drawTotalLine = (label: string, value: string, isBold = false) => {
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.text(label, 140, finalY);
        doc.text(value, 190, finalY, { align: "right" });
        finalY += 6;
      };

      drawTotalLine("Subtotal:", `Rs. ${subtotal.toLocaleString()}`);
      if (totalDiscount > 0)
        drawTotalLine("Discount:", `- Rs. ${totalDiscount.toLocaleString()}`);
      drawTotalLine(
        "Shipping:",
        `Rs. ${(order.shippingFee || 0).toLocaleString()}`
      );
      if (order.fee)
        drawTotalLine("Handling Fee:", `Rs. ${order.fee.toLocaleString()}`);

      finalY += 2;
      doc.setFontSize(12);
      drawTotalLine("Grand Total:", `Rs. ${grandTotal.toLocaleString()}`, true);

      // Save
      doc.save(`NEVERBE_Invoice_${order.orderId}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setLoadingInvoice(false);
    }
  };

  // --- EXPIRED STATE ---
  if (expired) {
    return (
      <main className="w-full min-h-screen flex flex-col justify-center items-center bg-white px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
            Link Expired
          </h1>
          <p className="text-gray-500 font-medium text-sm mb-8">
            For security reasons, this order confirmation link is no longer
            active.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  // --- SUCCESS STATE ---
  return (
    <main className="w-full min-h-screen bg-white pt-32 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-2xl animate-fadeIn">
        <SuccessAnimationComponents />

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
          Order Confirmed
        </h1>

        <p className="text-lg text-gray-500 font-medium mb-2">
          Thank you, {order.customer.name.split(" ")[0]}.
        </p>

        <div className="inline-block px-4 py-1 bg-gray-100 rounded-sm mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
            Order ID: <span className="text-black">#{order.orderId}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <button
            onClick={handleDownloadInvoice}
            disabled={loadingInvoice}
            className="flex-1 sm:flex-none py-4 px-8 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 rounded-sm"
          >
            {loadingInvoice ? (
              <span>Processing...</span>
            ) : (
              <>
                <IoDownloadOutline size={18} /> Invoice
              </>
            )}
          </button>

          <Link
            href="/"
            className="flex-1 sm:flex-none py-4 px-8 border border-black text-black font-bold uppercase tracking-widest hover:bg-gray-50 transition-all rounded-sm flex items-center justify-center gap-2"
          >
            Continue Shopping <IoArrowForward />
          </Link>
        </div>

        <p className="mt-12 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
          A confirmation email has been sent to {order.customer.email}
        </p>
      </div>
    </main>
  );
}
