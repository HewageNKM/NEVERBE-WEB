import React from "react";
import Orders from "@/app/account/components/Orders";
import {Metadata} from "next";
export const metadata:Metadata = {
    title: "My Orders"
}
const Page = () => {
    return (
        <div className="mt-32 p-4 md:p-8">
            <div className="max-w-6xl mx-auto  p-6 rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">My Orders</h1>
                <Orders />
            </div>
        </div>
    );
};

export default Page;
