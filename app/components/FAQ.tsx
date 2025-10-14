import React from 'react';
import { faqs } from "@/constants";
import FaqCard from "@/app/components/FAQCard";
import Link from "next/link";

const Faq = () => {
    return (
        <section className="w-full mt-10 lg:px-24 px-2" aria-labelledby="faq-section">
            <h2 id="faq-section" className="md:text-4xl font-display text-2xl font-bold px-8">
                <strong>FAQ</strong>
            </h2>
            <h3 className="text-lg md:text-xl text-primary mt-2 px-8">
                Frequently Asked Questions
            </h3>
            <div className="p-8">
                <ul className="flex flex-row flex-wrap justify-center gap-10 mt-10 w-full" role="list">
                    {faqs.map((faq, index) => (
                        <li key={index} role="listitem">
                            <FaqCard index={index} faq={faq} />
                        </li>
                    ))}
                </ul>
                <div className="mt-5">
                    <Link href={"#footer"} className="md:text-lg text-xs tracking-wide" aria-label="Read our terms and conditions">
                        *Terms and conditions apply.
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Faq;
