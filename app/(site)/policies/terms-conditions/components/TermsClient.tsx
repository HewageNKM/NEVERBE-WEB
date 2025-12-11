"use client";

import React from "react";
import TermsContent from "./TermsContent";

const TermsClient = () => {
  return (
    <main className="w-full lg:mt-32 md:mt-16 mt-20 min-h-screen lg:px-48 md:px-24 px-8 py-16">
      <h1 className="lg:text-6xl md:text-5xl text-3xl font-extrabold text-gray-900 tracking-wide text-center mb-12">
        Terms & Conditions
      </h1>

      <div>
        <TermsContent />
      </div>
    </main>
  );
};

export default TermsClient;
