"use client";
import React from "react";
import { faqs } from "@/constants";
import FaqCard from "@/app/(site)/components/FAQCard";

const Faq = () => {
  return (
    <section
      className="w-full mt-10 lg:px-8 px-2 py-4"
      aria-labelledby="faq-section"
    >
      {/* Header */}
      <div className="px-8">
        <h2
          id="faq-section"
          className="md:text-4xl font-display text-2xl font-bold"
        >
          <strong>FAQ</strong>
        </h2>
        <h3 className="text-lg md:text-xl text-primary mt-2">
          Frequently Asked Questions
        </h3>
      </div>

      {/* FAQ Cards */}
      <div className="p-8">
        <ul
          className="flex flex-row flex-wrap justify-center gap-10 mt-10 w-full"
          role="list"
        >
          {faqs.map((faq, index) => (
            <li key={index} role="listitem">
              <FaqCard index={index} faq={faq} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Faq;
