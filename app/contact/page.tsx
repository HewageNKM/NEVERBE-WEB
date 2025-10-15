import React from "react";
import { Metadata } from "next";
import ContactDetailsSection from "@/app/contact/components/ContactDetailsSection";
import SocialMediaSection from "@/app/contact/components/SocialMediaSection";
import MapSection from "@/app/contact/components/MapSection";

export const metadata: Metadata = {
  title: "Contact Us - NEVERBE",
  description:
    "Contact NEVERBE for any inquiries, support requests, or feedback. Reach us via email, social media, or visit our store location.",
  keywords:
    "NEVERBE, contact, support, inquiries, feedback, social media, whatsapp",
  openGraph: {
    title: "Contact Us - NEVERBE",
    description:
      "Get in touch with NEVERBE via email, social media, or WhatsApp.",
    url: "https://neverbe.lk/contact",
    type: "website",
    images: [
      {
        url: "https://neverbe.lk/api/og",
        width: 260,
        height: 260,
        alt: "NEVERBE Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@neverbe",
    creator: "@neverbe",
  },
};

const ContactPage = () => {
  return (
    <div className="min-h-screen mt-24 lg:mt-40 flex flex-col items-center px-4 sm:px-6 lg:px-12">
      {/* --- Header Section --- */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display">
          Contact Us
        </h1>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
          We’d love to hear from you. Whether you have a question, feedback, or
          just want to say hello — we’re here to help!
        </p>
      </header>

      {/* --- Main Content Section --- */}
      <div className="w-full max-w-6xl p-6 sm:p-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ContactDetailsSection />
          <SocialMediaSection />
        </div>

        <MapSection />
      </div>
    </div>
  );
};

export default ContactPage;
