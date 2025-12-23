"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Logo } from "@/assets/images";
import toast from "react-hot-toast";
import { Order } from "@/interfaces/Order";

interface InvoiceProps {
  order: Order;
  className?: string;
  btnText?: React.ReactNode;
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

  // NEVERBE Brand Colors in RGB
  const BRAND_GREEN = [151, 225, 62]; // #97e13e
  const BRAND_DARK = [26, 26, 26]; // #1a1a1a

  const generateInvoice = async () => {
    if (loading) return;

    setLoading(true);
    if (onDownloadStart) onDownloadStart();

    try {
      const doc = new jsPDF();

      // --- Logo & Header ---
      const imgWidth = 22;
      const imgHeight = 22;
      const centerX = 105;

      // Logo
      doc.addImage(
        Logo.src,
        "PNG",
        centerX - imgWidth / 2,
        25 - imgHeight / 2,
        imgWidth,
        imgHeight
      );

      // Title - Performance Italic look via Helvetica-BoldOblique
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(24);
      doc.setTextColor(...BRAND_DARK);
      doc.text("INVOICE", 105, 55, { align: "center" });

      // --- Details Section ---
      let yPos = 75;

      // Company Info
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("NEVERBE CLOTHING", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("330/4/10 New Kandy Road", 20, yPos + 5);
      doc.text("Delgoda, Sri Lanka", 20, yPos + 10);
      doc.text("support@neverbe.lk", 20, yPos + 15);

      // Order Info
      doc.setTextColor(...BRAND_DARK);
      doc.setFont("helvetica", "bold");
      doc.text("Order Summary", 140, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`ID: #${order.orderId.toUpperCase()}`, 140, yPos + 5);
      doc.text(`Date: ${order.createdAt}`, 140, yPos + 10);
      doc.text(`Payment: ${order.paymentMethod.toUpperCase()}`, 140, yPos + 15);

      yPos += 25;

      // --- Addresses ---
      const { customer } = order;

      // Customer Layout
      doc.setTextColor(...BRAND_DARK);
      doc.setFont("helvetica", "bold");
      doc.text("Deliver To:", 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(customer.shippingName || customer.name, 20, yPos + 5);
      doc.text(customer.shippingAddress || customer.address, 20, yPos + 10);
      doc.text(
        `${customer.shippingCity || customer.city} ${
          customer.shippingZip || ""
        }`,
        20,
        yPos + 15
      );
      doc.text(customer.shippingPhone || customer.phone, 20, yPos + 20);

      // Divider
      yPos += 30;
      doc.setDrawColor(...BRAND_GREEN);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, 190, yPos);

      // --- Item Table ---
      const itemData: (string | number)[][] = [];

      // ... (Grouping logic remains the same as your source) ...
      const comboGroups = new Map<string, typeof order.items>();
      const regularItems: typeof order.items = [];
      order.items.forEach((item) => {
        if (item.isComboItem && item.comboId) {
          if (!comboGroups.has(item.comboId)) comboGroups.set(item.comboId, []);
          comboGroups.get(item.comboId)!.push(item);
        } else {
          regularItems.push(item);
        }
      });

      regularItems.forEach((item) => {
        itemData.push([
          item.name.toUpperCase(),
          item.size || "-",
          item.quantity,
          `Rs. ${item.price.toLocaleString()}`,
          `Rs. ${(item.discount || 0).toLocaleString()}`,
          `Rs. ${(
            item.price * item.quantity -
            (item.discount || 0)
          ).toLocaleString()}`,
        ]);
      });

      comboGroups.forEach((items, comboId) => {
        const comboName = items[0]?.comboName || "Combo Bundle";
        const comboDiscount = items.reduce(
          (sum, i) => sum + (i.discount || 0),
          0
        );
        itemData.push([
          `[BUNDLE] ${comboName.toUpperCase()}`,
          "",
          "",
          "",
          `- Rs. ${comboDiscount.toLocaleString()}`,
          "",
        ]);
        items.forEach((item) => {
          itemData.push([
            `  > ${item.name}`,
            item.size || "-",
            item.quantity,
            `Rs. ${item.price.toLocaleString()}`,
            "",
            "",
          ]);
        });
      });

      autoTable(doc, {
        startY: yPos + 10,
        head: [
          ["ITEM DESCRIPTION", "SIZE", "QTY", "UNIT PRICE", "SAVINGS", "TOTAL"],
        ],
        body: itemData,
        theme: "striped",
        headStyles: {
          fillColor: BRAND_GREEN,
          textColor: BRAND_DARK,
          fontStyle: "bold",
          fontSize: 9,
        },
        styles: { fontSize: 9, cellPadding: 4, font: "helvetica" },
        columnStyles: {
          5: { halign: "right", fontStyle: "bold" },
        },
        didParseCell: (data: any) => {
          if (
            data.section === "body" &&
            data.row.raw[0]?.toString().startsWith("[BUNDLE]")
          ) {
            data.cell.styles.fillColor = [240, 250, 230];
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      // --- Totals Section ---
      const subtotal = order.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const totalDiscount =
        order.items.reduce((sum, i) => sum + (i.discount || 0), 0) +
        (order.discount || 0);
      const grandTotal =
        subtotal - totalDiscount + (order.shippingFee || 0) + (order.fee || 0);

      let finalY = (doc as any).lastAutoTable.finalY + 15;

      const drawTotalLine = (
        label: string,
        value: string,
        isBold = false,
        isGreen = false
      ) => {
        if (isGreen) doc.setTextColor(...BRAND_GREEN);
        else doc.setTextColor(...BRAND_DARK);

        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setFontSize(isBold ? 12 : 10);
        doc.text(label, 130, finalY);
        doc.text(value, 190, finalY, { align: "right" });
        finalY += 7;
      };

      drawTotalLine("Subtotal:", `Rs. ${subtotal.toLocaleString()}`);
      if (totalDiscount > 0)
        drawTotalLine(
          "Discount Applied:",
          `- Rs. ${totalDiscount.toLocaleString()}`,
          false,
          true
        );
      drawTotalLine(
        "Shipping Fee:",
        order.shippingFee === 0
          ? "FREE"
          : `Rs. ${order.shippingFee.toLocaleString()}`
      );

      finalY += 3;
      doc.setDrawColor(...BRAND_DARK);
      doc.line(130, finalY - 5, 190, finalY - 5);
      drawTotalLine("GRAND TOTAL:", `Rs. ${grandTotal.toLocaleString()}`, true);

      // --- Footer ---
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Thank you for shopping with NEVERBE. Stay Vibrant.", 105, 285, {
        align: "center",
      });

      doc.save(`NEVERBE_INV_${order.orderId.toUpperCase()}.pdf`);
      toast.success("Invoice Downloaded");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Download failed");
    } finally {
      setLoading(false);
      if (onDownloadEnd) onDownloadEnd();
    }
  };

  return (
    <button
      onClick={generateInvoice}
      disabled={loading}
      className={`
        group flex items-center justify-center gap-2 px-8 py-3 
        bg-dark text-inverse rounded-full 
        font-display font-black uppercase italic tracking-widest text-xs
        hover:bg-accent hover:text-dark transition-all duration-300
        disabled:bg-surface-3 disabled:text-muted disabled:cursor-not-allowed
        shadow-custom hover:shadow-hover active:scale-95
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-t-transparent border-accent rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        btnText
      )}
    </button>
  );
};

export default Invoice;
