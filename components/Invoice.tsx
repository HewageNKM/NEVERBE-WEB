"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "@/interfaces";
import { Logo } from "@/assets/images";
import toast from "react-hot-toast";

interface InvoiceProps {
  order: Order;
  className?: string; // Allow custom styling
  btnText?: React.ReactNode; // Allow custom button text/icon
  onDownloadStart?: () => void;
  onDownloadEnd?: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({
  order,
  className,
  btnText = "Download Invoice",
  onDownloadStart,
  onDownloadEnd,
}) => {
  const [loading, setLoading] = useState(false);

  const generateInvoice = async () => {
    if (loading) return;

    setLoading(true);
    if (onDownloadStart) onDownloadStart();

    try {
      const doc = new jsPDF();

      // --- Logo & Header ---
      const imgWidth = 25;
      const imgHeight = 25;
      const centerX = 105;

      // Logo (No Background)
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

      // Company Info
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("NEVERBE", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("330/4/10 New Kandy Road", 20, yPos + 5);
      doc.text("Delgoda, Sri Lanka", 20, yPos + 10);
      doc.text("support@neverbe.lk", 20, yPos + 15);

      // Order Info
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Order Details", 140, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`ID: #${order.orderId}`, 140, yPos + 5);
      doc.text(`Date: ${order.createdAt}`, 140, yPos + 10);
      doc.text(`Payment: ${order.paymentMethod}`, 140, yPos + 15);

      yPos += 25;

      // --- Addresses ---
      const { customer } = order;

      // Billing Address
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Billing Address", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(customer.name, 20, yPos + 5);
      doc.text(customer.address, 20, yPos + 10);
      doc.text(
        `${customer.city}${customer.zip ? `, ${customer.zip}` : ""}`,
        20,
        yPos + 15
      );
      doc.text(customer.phone, 20, yPos + 20);

      // Shipping Address
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Shipping Address", 140, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(customer.shippingName || customer.name, 140, yPos + 5);
      doc.text(customer.shippingAddress || customer.address, 140, yPos + 10);
      doc.text(
        `${customer.shippingCity || customer.city}${
          customer.shippingZip || customer.zip
            ? `, ${customer.shippingZip || customer.zip}`
            : ""
        }`,
        140,
        yPos + 15
      );
      doc.text(customer.shippingPhone || customer.phone, 140, yPos + 20);

      // Divider
      yPos += 30;
      doc.setDrawColor(230);
      doc.line(20, yPos, 190, yPos);

      // --- Item Table ---
      const itemData = order.items.map((item) => [
        item.name,
        item.size || "-",
        item.quantity,
        `Rs. ${item.price.toLocaleString()}`,
        `Rs. ${(item.discount || 0).toLocaleString()}`,
        `Rs. ${(item.price * item.quantity).toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: yPos + 10,
        head: [["Item", "Size", "Qty", "Price", "Discount", "Total"]],
        body: itemData,
        theme: "plain",
        headStyles: { fillColor: [0, 0, 0], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      // --- Totals ---
      const subtotal = order.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const itemsDiscount = order.items.reduce(
        (sum, i) => sum + (i.discount || 0),
        0
      );
      // Total discount might also include a global order discount if applicable,
      // ensuring we capture everything.
      const totalDiscount = itemsDiscount + (order.discount || 0);

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
      toast.success("Invoice downloaded successfully.");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to download invoice.");
    } finally {
      setLoading(false);
      if (onDownloadEnd) onDownloadEnd();
    }
  };

  return (
    <button onClick={generateInvoice} disabled={loading} className={className}>
      {loading ? "Downloading..." : btnText}
    </button>
  );
};

export default Invoice;
