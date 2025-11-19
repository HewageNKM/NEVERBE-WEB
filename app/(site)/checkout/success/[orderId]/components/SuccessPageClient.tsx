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

      // --- Logo ---
      const imgWidth = 25;
      const imgHeight = 25;
      const centerX = 105;
      const circleRadius = 18;
      doc.setFillColor(0, 0, 0);
      doc.circle(centerX, 30, circleRadius, "F");
      doc.addImage(
        Logo.src,
        "PNG",
        centerX - imgWidth / 2,
        30 - imgHeight / 2,
        imgWidth,
        imgHeight
      );

      // --- Header ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("INVOICE", 105, 60, { align: "center" });

      // --- Store / Company Info (Left) ---
      let storeY = 75;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12); // titles same size
      doc.setTextColor(0);
      doc.text("Store Details", 20, storeY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      storeY += 6;
      doc.text("NEVERBE", 20, storeY);
      storeY += 6;
      doc.text("330/4/10 New Kandy Road, Delgoda", 20, storeY);
      storeY += 6;
      doc.text("support@neverbe.lk", 20, storeY);
      storeY += 6;
      doc.text("+94 70 520 8999", 20, storeY);
      storeY += 6;
      doc.text("+94 72 924 9999", 20, storeY);

      // --- Invoice Details (Right) ---
      let invoiceY = 75;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12); // same as store title
      doc.setTextColor(0);
      doc.text("Invoice Details", 140, invoiceY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      invoiceY += 6;
      doc.text(`Order ID: ${order.orderId}`, 140, invoiceY);
      invoiceY += 6;
      doc.text(`Date: ${order.createdAt}`, 140, invoiceY);
      invoiceY += 6;
      doc.text(`Payment: ${order.paymentMethod}`, 140, invoiceY);
      invoiceY += 6;
      doc.text(`Status: ${order.paymentStatus}`, 140, invoiceY);

      // --- Divider ---
      const lineY = Math.max(storeY, invoiceY) + 6; // spacing below tallest section
      doc.setDrawColor(200);
      doc.line(20, lineY, 190, lineY);

      // --- Billing & Shipping Info ---
      const billing = order.customer;
      const shipping = {
        name: order.customer.shippingName,
        address: order.customer.shippingAddress,
        city: order.customer.shippingCity,
        zip: order.customer.shippingZip,
        phone: order.customer.shippingPhone,
      };
      const sameAsBilling =
        !shipping.name &&
        !shipping.address &&
        !shipping.city &&
        !shipping.phone;

      // Billing
      let billingY = lineY + 6; // start just below line
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Billing Details:", 20, billingY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(60);
      let yPos = billingY + 6;
      doc.text(billing.name, 20, yPos);
      if (billing.address) doc.text(billing.address, 20, (yPos += 6));
      if (billing.city) doc.text(billing.city, 20, (yPos += 6));
      if (billing.zip) doc.text(`Postal Code: ${billing.zip}`, 20, (yPos += 6));
      doc.text(`Phone: ${billing.phone}`, 20, (yPos += 6));
      doc.text(`Email: ${billing.email}`, 20, (yPos += 6));

      // Shipping
      let shipY = billingY;
      if (!sameAsBilling) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("Shipping Details:", 120, shipY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60);
        shipY += 6;
        if (shipping.name) doc.text(shipping.name, 120, shipY);
        if (shipping.address) doc.text(shipping.address, 120, (shipY += 6));
        if (shipping.city) doc.text(shipping.city, 120, (shipY += 6));
        if (shipping.zip) doc.text(`Postal Code: ${shipping.zip}`, 120, (shipY += 6));
        if (shipping.phone)
          doc.text(`Phone: ${shipping.phone}`, 120, (shipY += 6));
      } else {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100);
        doc.text("Shipping: Same as billing", 120, shipY + 6);
      }

      // --- Items Table ---
      const itemData = order.items.map((item) => {
        const totalPrice = item.price * item.quantity;
        const discount = item.discount || 0;
        const finalTotal = totalPrice - discount;

        return [
          item.name,
          item.variantName || "-",
          item.size || "-",
          item.quantity,
          `Rs. ${item.price.toFixed(2)}`,
          `Rs. ${discount.toFixed(2)}`,
          `Rs. ${finalTotal.toFixed(2)}`,
        ];
      });

      autoTable(doc, {
        startY: Math.max(yPos, shipY) + 12, // extra spacing
        head: [
          ["Item", "Variant", "Size", "Qty", "Price", "Discount", "Total"],
        ],
        body: itemData,
        theme: "striped",
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        styles: { fontSize: 10, halign: "center", cellPadding: 4 },
      });

      // --- Totals ---
      const subtotal = order.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const totalDiscount = order.items.reduce(
        (sum, i) => sum + (i.discount || 0),
        0
      );
      const shippingFee = order.shippingFee || 0;
      const fee = order.fee || 0;
      const grandTotal = subtotal - totalDiscount + shippingFee + fee;

      let totalsY = (doc as any).lastAutoTable.finalY + 12;
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(120, totalsY - 6, 70, 50, 3, 3, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60);
      doc.text("Subtotal:", 130, totalsY);
      doc.text("Total Discount:", 130, totalsY + 8);
      doc.text("Shipping Fee:", 130, totalsY + 16);
      doc.text("Fee:", 130, totalsY + 24);

      doc.setFont("helvetica", "bold");
      doc.text("Grand Total:", 130, totalsY + 36);

      doc.setFont("helvetica", "normal");
      doc.text(`Rs. ${subtotal.toFixed(2)}`, 185, totalsY, { align: "right" });
      doc.text(`Rs. ${totalDiscount.toFixed(2)}`, 185, totalsY + 8, {
        align: "right",
      });
      doc.text(`Rs. ${shippingFee.toFixed(2)}`, 185, totalsY + 16, {
        align: "right",
      });
      doc.text(`Rs. ${fee.toFixed(2)}`, 185, totalsY + 24, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(`Rs. ${grandTotal.toFixed(2)}`, 185, totalsY + 36, {
        align: "right",
      });

      // --- Footer ---
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Thank you for shopping with NEVERBE!", 105, 285, {
        align: "center",
      });
      doc.text("www.neverbe.lk", 105, 291, { align: "center" });

      doc.save(`Invoice_${order.orderId}.pdf`);
    } catch (error) {
      console.error("Invoice generation failed:", error);
    } finally {
      setLoadingInvoice(false);
    }
  };

  // --- Expired Page ---
  if (expired) {
    return (
      <main className="w-full min-h-screen flex justify-center items-center">
        <div className="text-center flex flex-col items-center gap-6 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-red-700 font-medium text-base md:text-lg max-w-md">
            ⚠️ This order link has expired. Invoice download is no longer
            available.
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

  // --- Normal Success Page ---
  return (
    <main className="w-full min-h-screen flex">
      <div className="w-full flex mx-auto justify-center items-center">
        <div className="md:mt-32 mt-24 w-fit rounded-2xl md:p-10 p-2 flex flex-row gap-6">
          <SuccessAnimationComponents />

          <div className="w-full flex flex-col gap-2">
            <div>
              <h2 className="font-display md:text-3xl text-xl font-bold text-primary-100 mb-2">
                Your Order ID Is #{order.orderId}
              </h2>
              <p className="text-gray-600 mb-4 text-base md:text-lg">
                Thank you for your purchase, {order.customer.name.split(" ")[0]}
                !
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
