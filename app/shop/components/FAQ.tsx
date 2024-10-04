import React from 'react';
import {faqs} from "@/constants";
import FaqCard from "@/app/shop/components/FAQCard";
import Link from "next/link";

const Faq = () => {
    return (
        <div className="w-full">
            <div className="p-8">
                <h1 className="text-4xl font-bold">
                    FAQ
                </h1>
                <div className="flex flex-row flex-wrap justify-center gap-10 mt-10 w-full">
                    {faqs.map((faq, index) => (
                        <FaqCard index={index} faq={faq} key={index}/>
                    ))}
                </div>
                <div className="mt-5">
                    <Link href="#footer" className="md:text-lg text-xs tracking-wide">
                        *Terms and conditions apply.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Faq;