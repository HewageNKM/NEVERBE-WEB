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
      <main className="w-full min-h-screen flex flex-col justify-center items-center bg-surface px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-3xl font-display font-black uppercase italic tracking-tighter mb-4 text-primary">
            Link Expired
          </h1>
          <p className="text-muted font-medium text-sm mb-8">
            For security reasons, this order confirmation link is no longer
            active.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest border-b-2 border-accent pb-1 text-primary hover:text-accent transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  // --- SUCCESS STATE ---
  return (
    <main className="w-full min-h-screen bg-surface pt-10 md:pt-16 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-2xl animate-fadeIn">
        <SuccessAnimationComponents />

        <h1 className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tighter leading-none mb-4 text-primary">
          Order Confirmed
        </h1>

        <p className="text-lg text-muted font-medium mb-2">
          Thank you, {order.customer.name.split(" ")[0]}.
        </p>

        <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-primary">
            Order ID: <span className="text-accent">#{order.orderId}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Invoice
            order={order}
            className="flex-1 sm:flex-none py-4 px-8 bg-dark text-inverse font-display font-black uppercase tracking-widest hover:bg-accent hover:text-dark disabled:bg-surface-3 transition-all flex items-center justify-center gap-2 rounded-full shadow-custom hover:shadow-hover"
            btnText={
              <>
                <IoDownloadOutline size={18} /> Invoice
              </>
            }
          />

          <Link
            href="/"
            className="flex-1 sm:flex-none py-4 px-8 border-2 border-dark text-primary font-display font-black uppercase tracking-widest hover:bg-dark hover:text-inverse transition-all rounded-full flex items-center justify-center gap-2"
          >
            Continue Shopping <IoArrowForward />
          </Link>

          <Link
            href="/account"
            className="flex-1 sm:flex-none py-4 px-8 border border-default text-primary font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all rounded-full flex items-center justify-center gap-2"
          >
            Go to Account
          </Link>
        </div>

        <p className="mt-12 text-[10px] text-muted font-medium uppercase tracking-wide">
          A confirmation email has been sent to {order.customer.email}
        </p>
      </div>
    </main>
  );
}
