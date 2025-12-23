"use client";
import React from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaFacebookF, FaLink } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface ShareButtonsProps {
  title: string;
  url: string;
  image?: string;
  className?: string;
}

/**
 * ShareButtons - NEVERBE Brand Style
 * Optimized for the Sri Lankan market with a performance-driven UI.
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url,
  className = "",
}) => {
  const fullUrl =
    typeof window !== "undefined" ? window.location.origin + url : url;

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out ${title} on NEVERBE!\n${fullUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(fullUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Blueprint link copied!", {
        style: {
          background: "#1a1a1a",
          color: "#97e13e",
          fontWeight: "bold",
          fontSize: "12px",
          textTransform: "uppercase",
        },
      });
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className} animate-fade`}>
      {/* Performance Label */}
      <span className="text-[10px] font-display font-black uppercase italic tracking-[0.2em] text-muted">
        Share the Gear
      </span>

      <div className="flex items-center gap-3">
        {/* WhatsApp - Primary platform for SL market */}
        <button
          onClick={shareToWhatsApp}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-[#25D366]/40 hover:-translate-y-1 transition-all active:scale-90"
          aria-label="Share on WhatsApp"
        >
          <IoLogoWhatsapp size={24} />
        </button>

        {/* Facebook */}
        <button
          onClick={shareToFacebook}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] text-white shadow-lg hover:shadow-[#1877F2]/40 hover:-translate-y-1 transition-all active:scale-90"
          aria-label="Share on Facebook"
        >
          <FaFacebookF size={20} />
        </button>

        {/* Copy Link - Branded Performance Style */}
        <button
          onClick={copyLink}
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-dark text-accent border border-accent/20 shadow-custom hover:bg-accent hover:text-dark hover:shadow-hover hover:-translate-y-1 transition-all active:scale-90"
          aria-label="Copy link"
        >
          <FaLink
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
