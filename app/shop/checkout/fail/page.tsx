import React from 'react';
import Link from "next/link";
import FailAnimationComponent from "@/app/shop/checkout/fail/components/FailAnimationComponent";

const Page = () => {

    return (
        <main className="w-full md:mt-20 mb-10 lg:mt-28 mt-16 flex justify-center items-center">
            <div className="w-fit h-[18rem] p-8 flex flex-col gap-5 justify-center items-center">
                <FailAnimationComponent/>
                <div
                    className="font-bold gap-3 flex flex-col md:text-xl lg:text-2xl justify-center items-center capitalize text-red-500 text-lg">
                    <h3 className="text-center">
                        Sorry, Your order placement has been failed!
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