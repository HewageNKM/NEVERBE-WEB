import React from "react";
import Link from "next/link";
import { IoHeadset } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import FailAnimationComponent from "@/app/checkout/fail/components/FailAnimationComponent";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Order Failed",
};

const Page = () => {
  return (
    <main className="w-full min-h-screen flex justify-center items-center">
      <div className="w-fit">
        <div className="md:mt-32 mt-24 w-fit rounded-2xl md:p-10 p-2 flex flex-row gap-6">
          {/* ❌ Fail Animation */}
          <FailAnimationComponent />

          {/* Text + Buttons Section */}
          <div className="w-full flex flex-col gap-2">
            <div>
              <h2 className="font-display md:text-3xl text-xl font-bold text-red-600 mb-2">
                Order Placement Failed!
              </h2>
              <p className="text-gray-600 mb-4 text-base md:text-lg">
                We couldn’t complete your order. Please try again or contact our
                support team for assistance.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-row flex-wrap gap-2 md:mt-2 mt-1 justify-start items-start">
              <a
                href="/contact"
                className="px-6 py-3 flex flex-row md:text-lg text-xs justify-center items-center gap-2 rounded-lg text-white font-button bg-red-600 hover:bg-red-700 transition-all"
              >
                <IoHeadset size={20} />
                Contact Support
              </a>

              <Link
                href="/"
                className="px-6 py-3 flex flex-row md:text-lg text-xs justify-center items-center gap-2 font-button text-red-600 hover:text-red-700 transition-all"
              >
                <FaArrowLeft size={20} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
