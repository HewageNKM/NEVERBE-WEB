"use client";

import React from "react";
import { termsAndConditions } from "@/constants";

const TermsContent = () => {
  return (
    <div className="flex flex-col gap-10 w-full">
      {termsAndConditions.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 p-6 bg-white rounded-lg shadow-custom transition duration-300 hover:shadow-lg"
        >
          <h2 className="md:text-2xl font-bold text-xl text-gray-800">
            {index + 1 + ". " + item.title}
          </h2>
          <p className="text-md md:text-lg text-gray-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TermsContent;
