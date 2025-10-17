"use client";

import React, { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "@/interfaces";
import SuccessAnimationComponents from "./SuccessAnimationComponents";
import { BiDownload } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa6";
import { Logo } from "@/assets/images";

export default function SuccessPageClient({ order, expired }: { order: Order, expired?: boolean}) {
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const handleDownloadInvoice = async () => {
    setLoadingInvoice(true);
    try {
      const doc = new jsPDF();

      // --- Logo (centered, circular background) ---
      const imgWidth = 25;
      const imgHeight = 25;
      const centerX = 105;
      const circleRadius = 18;

      doc.setFillColor(0, 0, 0);
      doc.circle(centerX, 30, circleRadius, "F");

      doc.addImage(Logo.src, "PNG", centerX - imgWidth / 2, 30 - imgHeight / 2, imgWidth, imgHeight);

      // --- Header Title ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("INVOICE", 105, 60, { align: "center" });

      // --- Company Info ---
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text("NEVERBE", 20, 75);
      doc.text("330/4/10 New Kandy Road, Delgoda", 20, 81);
      doc.text("support@neverbe.lk", 20, 87);
      doc.text("+94 70 520 8999", 20, 93);

      // --- Invoice Info (right column) ---
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Invoice Details", 140, 75);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Order ID: ${order.orderId}`, 140, 81);
      doc.text(`Date: ${order.createdAt}`, 140, 87);
      doc.text(`Payment: ${order.paymentMethod}`, 140, 93);
      doc.text(`Status: ${order.paymentStatus}`, 140, 99);

      // --- Divider Line ---
      doc.setDrawColor(200);
      doc.line(20, 105, 190, 105);

      // --- Customer Info ---
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Bill To:", 20, 115);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60);
      doc.text(order.customer.name, 20, 121);
      if (order.customer.address) doc.text(order.customer.address, 20, 127);
      if (order.customer.city) doc.text(order.customer.city, 20, 133);
      doc.text(`Phone: ${order.customer.phone}`, 20, 139);
      doc.text(`Email: ${order.customer.email}`, 20, 145);

      // --- Items Table ---
      const itemData = order.items.map((item) => [
        item.name,
        item.variantName || "-",
        item.size || "-",
        item.quantity,
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${(item.price * item.quantity).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 155,
        head: [["Item", "Variant", "Size", "Qty", "Price", "Total"]],
        body: itemData,
        theme: "striped",
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
          halign: "center",
          cellPadding: 4,
        },
      });

      // --- Totals Box ---
      let total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      let y = (doc as any).lastAutoTable.finalY + 12;

      const boxTop = y - 6;
      const boxHeight = 28;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(120, boxTop, 70, boxHeight, 3, 3, "F");

      doc.setFontSize(11);
      doc.setTextColor(60);
      doc.setFont("helvetica", "normal");
      doc.text("Discount:", 130, y);
      doc.text("Shipping Fee:", 130, y + 8);
      doc.setFont("helvetica", "bold");
      doc.text("Grand Total:", 130, y + 18);

      doc.setFont("helvetica", "normal");
      doc.text(`Rs. ${(order.discount || 0).toFixed(2)}`, 185, y, { align: "right" });
      doc.text(`Rs. ${(order.shippingFee || 0).toFixed(2)}`, 185, y + 8, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(
        `Rs. ${(total - (order.discount || 0) + (order.shippingFee || 0)).toFixed(2)}`,
        185,
        y + 18,
        { align: "right" }
      );

      // --- Footer ---
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Thank you for shopping with NEVERBE!", 105, 285, { align: "center" });
      doc.text("www.neverbe.lk", 105, 291, { align: "center" });

      doc.save(`Invoice_${order.orderId}.pdf`);
    } catch (error) {
      console.error("Invoice generation failed:", error);
    } finally {
      setLoadingInvoice(false);
    }
  };

  // --- EXPIRATION UI ONLY ---
  if (expired) {
    return (
      <main className="w-full min-h-screen flex justify-center items-center">
        <div className="text-center flex flex-col items-center gap-6 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-red-700 font-medium text-base md:text-lg max-w-md">
            ⚠️ This order link has expired. Invoice download is no longer available.
          </div>

          <Link
            href="/"
            className="px-6 py-3 flex flex-row justify-center items-center gap-2 rounded-lg text-white bg-primary-100 hover:bg-primary-200 font-button transition-all md:text-lg text-sm"
          >
            <FaArrowLeft size={18} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // --- NORMAL SUCCESS PAGE ---
  return (
    <main className="w-full min-h-screen flex">
      <div className="w-full flex mx-auto justify-center items-center">
        <div className="md:mt-32 mt-24 w-fit rounded-2xl md:p-10 p-2 flex flex-row gap-6">
          <SuccessAnimationComponents />

          <div className="w-full flex flex-col gap-2">
            <div>
              <h2 className="font-display md:text-3xl text-xl font-bold text-primary-100 mb-2">
                Order ID #{order.orderId}
              </h2>
              <p className="text-gray-600 mb-4 text-base md:text-lg">
                Thank you for your purchase, {order.customer.name.split(" ")[0]}!
              </p>
            </div>

            <div className="flex flex-row flex-wrap gap-2 md:mt-2 mt-1 justify-start items-start">
              <button
                onClick={handleDownloadInvoice}
                disabled={loadingInvoice}
                className={`px-6 py-3 flex flex-row md:text-lg text-xs justify-center items-center rounded-lg text-white font-button transition-all ${
                  loadingInvoice
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary-100 hover:bg-primary-200"
                }`}
              >
                <BiDownload size={20} className="mr-2" />
                {loadingInvoice ? "Generating..." : "Download Invoice"}
              </button>
            </div>

            <Link
              href="/"
              className="px-6 flex flex-row gap-2 py-3 md:text-lg text-xs font-button text-primary-100 hover:text-primary-200 transition-all"
            >
              <FaArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
