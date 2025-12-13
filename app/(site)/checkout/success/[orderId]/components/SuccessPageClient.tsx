"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order } from "@/interfaces";
import SuccessAnimationComponents from "./SuccessAnimationComponents";
import { IoDownloadOutline, IoArrowForward } from "react-icons/io5";
import { Logo } from "@/assets/images";
import Invoice from "@/components/Invoice";

export default function SuccessPageClient({
  order,
  expired,
}: {
  order: Order;
  expired?: boolean;
}) {
  /* Removed manual invoice logic */

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
    <main className="w-full min-h-screen bg-white pt-10 md:pt-16 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
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
          <Invoice
            order={order}
            className="flex-1 sm:flex-none py-4 px-8 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2 rounded-sm"
            btnText={
              <>
                <IoDownloadOutline size={18} /> Invoice
              </>
            }
          />

          <Link
            href="/"
            className="flex-1 sm:flex-none py-4 px-8 border border-black text-black font-bold uppercase tracking-widest hover:bg-gray-50 transition-all rounded-sm flex items-center justify-center gap-2"
          >
            Continue Shopping <IoArrowForward />
          </Link>

          <Link
            href="/account"
            className="flex-1 sm:flex-none py-4 px-8 border border-black text-black font-bold uppercase tracking-widest hover:bg-gray-50 transition-all rounded-sm flex items-center justify-center gap-2"
          >
            Go to Account
          </Link>
        </div>

        <p className="mt-12 text-[10px] text-gray-400 font-medium uppercase tracking-wide">
          A confirmation email has been sent to {order.customer.email}
        </p>
      </div>
    </main>
  );
}
