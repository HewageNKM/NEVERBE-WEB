import React from "react";
import { Metadata } from "next";
import CheckoutForm from "@/app/(site)/checkout/components/CheckoutForm";
import AnonymousConversionBanner from "@/components/AnonymousConversionBanner";

export const metadata: Metadata = {
  title: "Secure Checkout | NEVERBE",
};

const Page = () => {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* Simple Header for Checkout Focus */}
      <div className="w-full border-b border-gray-100 py-6 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Checkout
        </h1>
      </div>
      <AnonymousConversionBanner />

      <div className="w-full max-w-[1440px] mx-auto">
        <CheckoutForm />
      </div>
    </main>
  );
};

export default Page;
