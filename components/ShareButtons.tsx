"use client";
import React from "react";
import { IoLogoWhatsapp, IoShareSocialOutline } from "react-icons/io5";
import { FaFacebookF, FaLink } from "react-icons/fa";
import toast from "react-hot-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
  image?: string;
  className?: string;
}

/**
 * Social sharing buttons - WhatsApp is primary for Sri Lanka market
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
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* WhatsApp - Primary for Sri Lanka */}
      <button
        onClick={shareToWhatsApp}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:opacity-90 transition-opacity"
        aria-label="Share on WhatsApp"
      >
        <IoLogoWhatsapp size={20} />
      </button>

      {/* Facebook */}
      <button
        onClick={shareToFacebook}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
        aria-label="Share on Facebook"
      >
        <FaFacebookF size={16} />
      </button>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="Copy link"
      >
        <FaLink size={14} />
      </button>
    </div>
  );
};

export default ShareButtons;
