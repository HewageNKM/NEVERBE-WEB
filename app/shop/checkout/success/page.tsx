import React from 'react';
import Link from "next/link";
import SuccessAnimationComponents from './components/SuccessAnimationComponents';
import { getOrderById } from "@/firebase/firebaseAdmin";
import { notFound } from "next/navigation";

const Page = async ({ searchParams }: { searchParams: { order_id: string } }) => {
    const orderId = searchParams.order_id;
    let order;

    try {
        order = await getOrderById(orderId);
    } catch (e: any) {
        console.log(e.message);
        return notFound();
    }

    return (
        <main className="w-full min-h-screen flex justify-center items-center">
            <div className="bg-white shadow-custom rounded-lg p-10 flex flex-col gap-6 justify-center items-center max-w-lg">
                {/* Success Animation */}
                <SuccessAnimationComponents />

                {/* Order Details */}
                <div className="text-center">
                    <label className="font-semibold flex  justify-center items-center flex-col gap-1 text-gray-700 mb-2">
                        <span className="text-lg">Order ID:</span>
                        <input
                            value={order?.orderId}
                            readOnly
                            className="mt-2 w-fit p-2 text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </label>
                    <h3 className="text-2xl font-bold text-green-600 mt-4">
                        Payment {order?.paymentStatus}!
                    </h3>
                    <p className="text-gray-600 mt-2 text-lg">
                        Check your email for confirmation and further details.
                    </p>
                </div>

                {/* Back to Home Link */}
                <Link href="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-lg">
                    Go Back Home
                </Link>
            </div>
        </main>
    );
};

export default Page;
