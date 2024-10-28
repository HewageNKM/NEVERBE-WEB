import React from 'react';
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Temporarily Unavailable",
    description: "We are improving our service right now.",
};

const Page = () => (
    <main className="flex fixed w-full z-50 justify-center items-center min-h-screen bg-gray-900 px-6 py-12 lg:py-24">
        <div className="text-center space-y-6 max-w-lg text-white">
            <Image src={Logo} alt="Logo" className="mx-auto w-24 h-24 lg:w-32 lg:h-32" priority />
            <h1 className="text-2xl font-semibold text-slate-300 md:text-3xl">We&apos;ll Be Back Soon!</h1>
            <p className="text-md md:text-lg lg:text-xl text-gray-400 leading-relaxed">
                We&apos;re currently making improvements to enhance your experience. Please check back shortly.
            </p>
            <div className="mt-8">
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out transform hover:-translate-y-1">
                    <IoArrowBack className="text-2xl" />
                    Back to Shop
                </Link>
            </div>
        </div>
    </main>
);

export default Page;
