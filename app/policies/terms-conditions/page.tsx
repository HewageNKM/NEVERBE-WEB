import React from 'react';
import { termsAndConditions } from "@/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    twitter:{
        card: "summary",
        site: "@neverbe",
        creator: "@neverbe",
        title: "Terms & Conditions",
        description: "NEVERBE Terms & Conditions",
    }
};

const Page = () => {
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="lg:px-48 md:px-24 px-8 py-16 flex justify-center items-center flex-col gap-12">
                <h1 className="lg:text-6xl md:text-5xl text-3xl font-extrabold text-gray-900 tracking-wide text-center">
                    Terms & Conditions
                </h1>
                <article>
                    <div className="mt-10 flex-col flex gap-10 w-full">
                        {termsAndConditions.map((item, index) => (
                            <div key={index}
                                 className="flex flex-col gap-3 p-6 bg-white rounded-lg shadow-md transition duration-300 hover:shadow-lg">
                                <h2 className="md:text-2xl font-bold text-xl text-gray-800">
                                    {index + 1 + ". " + item.title}
                                </h2>
                                <p className="text-md md:text-lg text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default Page;
