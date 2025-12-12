"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { socialMedia } from "@/constants";

const SocialMediaSection = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(
    "Hello NEVERBE, I’d like to get in touch."
  );

  // Helper to map icons based on URL or logic
  const getIcon = (url: string) => {
    if (url.includes("facebook")) return <FaFacebookF size={18} />;
    if (url.includes("instagram")) return <FaInstagram size={18} />;
    if (url.includes("tiktok")) return <FaTiktok size={18} />;
    return null;
  };

  return (
    <section className="flex flex-col gap-8 mt-8 pt-8 border-t border-gray-100">
      <h2 className="text-xl font-black uppercase tracking-tighter">
        Follow Us
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* WhatsApp - Primary Action */}
        <Link
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 flex items-center justify-center gap-3 bg-black text-white px-6 py-4 hover:bg-gray-800 transition-all active:scale-[0.98]"
        >
          <FaWhatsapp size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">
            Chat on WhatsApp
          </span>
        </Link>

        {/* Social Grid */}
        {socialMedia.map((media, idx) => (
          <Link
            key={idx}
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 border border-gray-200 px-6 py-4 hover:border-black hover:bg-gray-50 transition-all group"
          >
            <span className="text-gray-400 group-hover:text-black transition-colors">
              {media.icon ? <media.icon size={18} /> : getIcon(media.url)}
            </span>
            <span className="font-bold uppercase tracking-wide text-xs text-gray-500 group-hover:text-black">
              {media.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SocialMediaSection;
