"use client";
import React from "react";
import { ContactUs } from "@/constants";

const MapSection = () => {
  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-display">
        Visit Our Store
      </h2>

      <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-sm">
        <iframe
          src={ContactUs.embeddedMap}
          loading="lazy"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default MapSection;
