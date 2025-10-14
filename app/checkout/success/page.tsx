import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getOrderById } from "@/firebase/firebaseAdmin";
import { notFound } from "next/navigation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SuccessAnimationComponents from "./components/SuccessAnimationComponents";
import { Order } from "@/interfaces";

const Page = async ({ searchParams }: { searchParams: { orderId: string } }) => {
  const orderId = searchParams.orderId;
  let order: Order | null = null;

  try {
    order = await getOrderById(orderId);
  } catch (e: any) {
    console.error(e.message);
    return notFound();
  }

  if (!order) return notFound();

  return <SuccessPage order={order} />;
};

export default Page;

// ---------- Client-Side Invoice + UI ----------
const SuccessPage = ({ order }: { order: Order }) => {
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const handleDownloadInvoice = async () => {
    setLoadingInvoice(true);
    try {
      const doc = new jsPDF();

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("INVOICE", 105, 20, { align: "center" });

      // Order Info
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Order ID: ${order.orderId}`, 20, 35);
      doc.text(`Payment Status: ${order.paymentStatus}`, 20, 43);
      doc.text(`Payment Method: ${order.paymentMethod}`, 20, 51);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 59);

      // Customer Info
      doc.setFont("helvetica", "bold");
      doc.text("Customer Details:", 20, 75);
      doc.setFont("helvetica", "normal");
      doc.text(`${order.customer.name}`, 20, 83);
      doc.text(`${order.customer.address}`, 20, 91);
      doc.text(`${order.customer.city}`, 20, 99);
      doc.text(`Phone: ${order.customer.phone}`, 20, 107);
      doc.text(`Email: ${order.customer.email}`, 20, 115);

      // Items Table
      const itemData = order.items.map((item) => [
        item.name,
        item.variantName || "-",
        item.size || "-",
        item.quantity,
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${(item.price * item.quantity).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 130,
        head: [["Item", "Variant", "Size", "Qty", "Price", "Total"]],
        body: itemData,
      });

      // Totals
      let total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      let y = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.text(`Discount: Rs. ${order.discount || 0}`, 140, y);
      doc.text(`Shipping Fee: Rs. ${order.shippingFee || 0}`, 140, y + 8);
      doc.text(`Grand Total: Rs. ${total - (order.discount || 0) + (order.shippingFee || 0)}`, 140, y + 16);

      // Footer
      doc.setFontSize(10);
      doc.text("Thank you for shopping with us!", 105, 280, { align: "center" });

      // Download file
      doc.save(`Invoice_${order.orderId}.pdf`);
    } catch (e) {
      console.error("Invoice generation failed:", e);
    } finally {
      setLoadingInvoice(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-white via-gray-50 to-primary-50">
      <div className="bg-white shadow-custom rounded-2xl p-10 flex flex-col gap-6 justify-center items-center max-w-lg w-[90%]">
        {/* Success Animation */}
        <SuccessAnimationComponents />

        {/* Order Details */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary-100 mb-2">
            Payment {order.paymentStatus}!
          </h2>
          <p className="text-gray-600 mb-4 text-base md:text-lg">
            Thank you for your purchase, {order.customer.name.split(" ")[0]}!
          </p>

          <div className="flex flex-col gap-1 items-center text-sm md:text-base text-gray-700">
            <span className="font-semibold">Order ID</span>
            <input
              value={order.orderId ?? ""}
              readOnly
              className="w-fit px-3 py-2 text-center uppercase text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-6 w-full justify-center">
          <button
            onClick={handleDownloadInvoice}
            disabled={loadingInvoice}
            className={`px-6 py-3 rounded-lg text-white font-button transition-all ${
              loadingInvoice
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-100 hover:bg-primary-200"
            }`}
          >
            {loadingInvoice ? "Generating..." : "Download Invoice"}
          </button>

          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all font-button"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </main>
  );
};
