import React from 'react';
import {Metadata} from "next";
import CheckoutForm from "@/app/checkout/components/CheckoutForm";

export const metadata: Metadata = {
    title: "Checkout"
}


const Page = () => {

    return (
        <main className="w-full mt-28 my-10 overflow-clip">
            <div className="lg:px-36 md:px-16 p-8 w-full flex justify-center items-center">
                <div className="w-full flex justify-center items-center">
                    <CheckoutForm/>
                </div>
            </div>
        </main>
    );
};

export default Page;