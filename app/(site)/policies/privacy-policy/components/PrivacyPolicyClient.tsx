"use client";

import React from "react";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

const PrivacyPolicyClient = () => {
  return (
    <main className="privacy-policy w-full lg:mt-32 mt-24 max-w-4xl mx-auto pt-10 p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900 font-display">
        Privacy Policy
      </h1>

      <div className="space-y-10">
        <PrivacyPolicyContent />
      </div>
    </main>
  );
};

export default PrivacyPolicyClient;
