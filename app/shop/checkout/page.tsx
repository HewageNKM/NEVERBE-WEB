import React from 'react';
import {Metadata} from "next";
import AddressDetails from "@/app/shop/checkout/components/AddressDetails";
import PaymentDetails from "@/app/shop/checkout/components/PaymentDetails";

export const metadata: Metadata = {
    title: "Checkout"
}


const Page = () => {

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