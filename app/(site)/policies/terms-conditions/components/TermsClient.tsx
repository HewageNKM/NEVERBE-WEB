"use client";

import React from "react";
import TermsContent from "./TermsContent";

const TermsClient = () => {
  return (
    <main className="w-full min-h-screen bg-white pt-8 md:pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 border-b border-black pb-8">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black leading-[0.9]">
            Terms & <br /> Conditions
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              User Agreement
            </p>
            <div className="hidden md:block h-px w-12 bg-gray-300"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Effective Date: {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl">
          <TermsContent />
        </div>
      </div>
    </main>
  );
};

export default TermsClient;
