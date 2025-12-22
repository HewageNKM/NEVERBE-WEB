"use client";
import React from "react";
import { ContactUs } from "@/constants";

const MapSection = () => {
  return (
    <section className="w-full h-full min-h-[400px] relative bg-surface-2 border border-gray-200 group overflow-hidden">
      {/* Label Overlay */}
      <div className="absolute top-6 left-6 z-10 bg-white px-4 py-2 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xs font-black uppercase tracking-widest">
          Store Location
        </h2>
      </div>

      <iframe
        src={ContactUs.embeddedMap}
        loading="eager"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
      ></iframe>
    </section>
  );
};

export default MapSection;
