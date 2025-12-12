"use client";

import React from "react";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

const PrivacyPolicyClient = () => {
  return (
    <main className="w-full min-h-screen bg-white pt-32 md:pt-40 pb-20 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-20 border-b border-black pb-8">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black leading-[0.9]">
            Privacy <br /> Policy
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="hidden md:block h-px w-12 bg-gray-300"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Legal & Compliance
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl">
          <PrivacyPolicyContent />
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyClient;
