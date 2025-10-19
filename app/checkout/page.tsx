import React from "react";
import { Metadata } from "next";
import CheckoutForm from "@/app/checkout/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

const Page = () => {
  return (
    <main className="w-full mt-2 md:mt-28 my-10 overflow-clip">
      <div className="w-full flex justify-center items-center">
        <CheckoutForm />
      </div>
    </main>
  );
};

export default Page;
