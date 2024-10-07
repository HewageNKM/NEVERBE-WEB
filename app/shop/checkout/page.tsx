import React from 'react';
import {Metadata} from "next";
import AddressDetails from "@/app/shop/checkout/components/AddressDetails";
import PaymentDetails from "@/app/shop/checkout/components/PaymentDetails";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
    title: "Checkout"
}


const Page = () => {
    const cart = window.localStorage.getItem("NEVERBECart");
    if (!cart || JSON.parse(cart).length === 0) {
        return notFound();
    }

    return (
        <main className="w-full mt-28 my-10 overflow-clip">
            <div className="lg:px-36 md:px-16 px-8 w-full flex justify-center items-center">
                <div className="flex flex-row flex-wrap justify-evenly lg:gap-32 gap-10 md:gap-20 mt-10">
                    <AddressDetails/>
                    <PaymentDetails/>
                </div>
            </div>
        </main>
    );
};

export default Page;