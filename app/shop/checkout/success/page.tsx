import React from 'react';
import Link from "next/link";
import SuccessAnimationComponents from './components/SuccessAnimationComponents';
import {getOrderById} from "@/firebase/firebaseAdmin";
import {notFound} from "next/navigation";

const Page = async ({ searchParams }: { searchParams: { order_id: string } }) => {
    const orderId = searchParams.order_id;
    const order = await getOrderById(orderId);
    if(!order) {
        return  notFound();
    }
    return (
        <main className="w-full md:mt-20 mb-10 lg:mt-28 mt-16 flex justify-center items-center">
            <div className="w-fit h-[18rem] p-8 flex flex-col gap-5 justify-center items-center">
                <SuccessAnimationComponents />
                <div className="font-bold gap-3 flex flex-col md:text-xl lg:text-2xl justify-center items-center capitalize text-green-500 text-lg">
                    <label className="text-center capitalize text-slate-500">
                        <span>Order ID:</span>
                        <input value={order.orderId} className="w-full p-2 focus:outline-none border-slate-300 border rounded-lg"/>
                    </label>
                    <h3 className="text-center">
                        Order Payment is {order?.paymentStatus}!, Check your email for confirmation
                    </h3>
                    <Link href="/" className="text-blue-500 md:text-lg text-sm">
                        Go back to home
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Page;