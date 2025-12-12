import React from "react";

const ProductFAQ = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is cash on delivery available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, NEVERBE offers Island-wide Cash on Delivery (COD) services in Sri Lanka.",
        },
      },
      {
        "@type": "Question",
        name: "How long does delivery take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Delivery typically takes 2-4 working days within Colombo and 3-5 working days for outstation areas.",
        },
      },
      {
        "@type": "Question",
        name: "What is the quality of these shoes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "These are Premium Master Copy (7A Grade) shoes, designed to offer the best comfort and durability at an affordable price.",
        },
      },
    ],
  };

  return (
    <section className="border-t border-gray-100 py-10 mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Visual FAQ (Hidden in 'Fine Print' style) */}
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="font-bold uppercase tracking-wide text-sm mb-6">
          Common Questions
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-xs text-gray-500">
          <div>
            <strong className="block text-black mb-1">Cash on Delivery?</strong>
            <p>Yes, available island-wide.</p>
          </div>
          <div>
            <strong className="block text-black mb-1">Delivery Time?</strong>
            <p>2-5 working days depending on location.</p>
          </div>
          <div>
            <strong className="block text-black mb-1">Exchange Policy?</strong>
            <p>We accept size exchanges within 7 days.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
