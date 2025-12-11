"use client";
import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { socialMedia } from "@/constants";

const SocialMediaSection = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(
    "Hello NEVERBE, I’d like to get in touch with you."
  );

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-gray-900 font-display">
        Connect With Us
      </h2>

      <p className="text-gray-600 max-w-md text-sm leading-relaxed">
        Reach out through our social media channels or send us a WhatsApp
        message — we’re always happy to chat!
      </p>

      <div className="flex flex-wrap gap-4">
        {/* WhatsApp */}
        <div className="transition hover:scale-105 active:scale-95">
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            <FaWhatsapp size={20} />
            <span>WhatsApp</span>
          </Link>
        </div>

        {/* Facebook */}
        <div className="transition hover:scale-105 active:scale-95">
          <Link
            href={socialMedia[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaFacebook size={24} />
            <span>Facebook</span>
          </Link>
        </div>

        {/* Instagram */}
        <div className="transition hover:scale-105 active:scale-95">
          <Link
            href={socialMedia[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500 transition-colors"
          >
            <FaInstagram size={24} />
            <span>Instagram</span>
          </Link>
        </div>

        {/* TikTok */}
        <div className="transition hover:scale-105 active:scale-95">
          <Link
            href={socialMedia[2].url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <FaTiktok size={24} />
            <span>TikTok</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
