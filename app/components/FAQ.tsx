import React from 'react';
import {faqs} from "@/constants";
import FaqCard from "@/app/components/FAQCard";
import Link from "next/link";

const Faq = () => {
    return (
        <section className="w-full mt-10">
            <div className="p-8">
                <div>
                    <h2 className="text-4xl font-bold">
                        <strong>
                            FAQ
                        </strong>
                    </h2>
                    <h3 className="text-xl md:text-2xl text-primary mt-2">
                        Frequently asked questions
                    </h3>
                </div>
                <ul className="flex flex-row flex-wrap justify-center gap-10 mt-10 w-full">
                    {faqs.map((faq, index) => (
                        <li key={index}>
                            <FaqCard index={index} faq={faq}/>
                        </li>
                    ))}
                </ul>
                <div className="mt-5">
                    <Link href={"#footer"} className="md:text-lg text-xs tracking-wide">
                        *Terms and conditions apply.
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Faq;