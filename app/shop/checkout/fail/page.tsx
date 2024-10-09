"use client"
import React from 'react';
import Lottie from "lottie-react";
import {FailAnimation} from "@/assets/animation";
import Link from "next/link";

const Page = () => {

    return (
        <main className="w-full md:mt-20 lg:mt-28 mt-10 flex justify-center items-center">
            <div
                className="w-fit h-[18rem] p-4 flex flex-col gap-5 justify-center items-center">
                <figure>
                    <Lottie animationData={FailAnimation} className="lg:w-[10vw] md:w-[15vw] w-[40vw]"/>
                </figure>
                <div
                    className="font-bold gap-3 flex flex-col md:text-2xl lg:text-3xl justify-center items-center capitalize text-red-500 text-lg">
                    <h3 className="text-center">
                        Sorry!, Your Order was unsuccessful!
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