import React from 'react';
import Link from "next/link";
import FailAnimationComponent from "@/app/checkout/fail/components/FailAnimationComponent";
import {IoHeadset} from "react-icons/io5";


export const metadata = {
    title: "Fail"
}
const Page = () => {
    return (
        <main className="w-full min-h-screen flex justify-center items-center">
            <div
                className="bg-white shadow-custom rounded-lg p-10 flex flex-col gap-6 justify-center items-center max-w-md">
                {/* Fail Animation */}
                <FailAnimationComponent/>

                {/* Message Section */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-2xl lg:text-3xl font-semibold text-red-600">
                        Order Placement Failed
                    </h3>
                    <p className="text-gray-600 mt-2 lg:text-lg text-base">
                        We couldn’t complete your order. Please try again or contact our support team for help.
                    </p>
                    <a href="/contact" className="flex items-center flex-row gap-2 mt-2 text-blue-500 hover:underline">
                        <IoHeadset size={24}/>
                        <p className="text-blue-500 hover:underline mt-2">
                            Contact Support
                        </p>
                    </a>
                </div>

                {/* Action Button */}
                <Link href="/"
                      className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-lg">
                    Back to Home
                </Link>
            </div>
        </main>
    );
};

export default Page;
