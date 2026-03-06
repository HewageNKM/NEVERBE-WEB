"use client";

import Link from "next/link";
import { Order } from "@/interfaces";
import SuccessAnimationComponents from "./SuccessAnimationComponents";
import { IoArrowForward } from "react-icons/io5";

export default function SuccessPageClient({ order }: { order: Order }) {
  // --- SUCCESS STATE ---
  return (
    <main className="w-full min-h-screen bg-surface pt-10 md:pt-16 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-2xl animate-fadeIn">
        <SuccessAnimationComponents />

        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none mb-4 text-primary-dark">
          Order Confirmed
        </h1>

        <p className="text-lg text-muted font-medium mb-2">
          Thank you, {order.customer.name.split(" ")[0]}.
        </p>

        <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-primary-dark">
            Order ID: <span className="text-accent">#{order.orderId}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link
            href="/"
            className="flex-1 sm:flex-none py-4 px-8 border-2 border-dark text-primary-dark font-display font-black uppercase tracking-widest hover:bg-dark hover:text-inverse transition-all rounded-full flex items-center justify-center gap-2"
          >
            Continue Shopping <IoArrowForward />
          </Link>

          <Link
            href="/account"
            className="flex-1 sm:flex-none py-4 px-8 border border-default text-primary-dark font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-all rounded-full flex items-center justify-center gap-2"
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
