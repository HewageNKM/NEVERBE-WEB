"use client";
import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { socialMedia } from "@/constants";
import { motion } from "framer-motion";

const SocialMediaSection = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent("Hello NEVERBE, I’d like to get in touch with you.");

  return (
    <motion.section
      className="flex flex-col gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.15 }}
    >
      <motion.h2
        className="text-2xl font-semibold text-gray-900 font-display"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Connect With Us
      </motion.h2>

      <motion.p
        className="text-gray-600 max-w-md text-sm leading-relaxed"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Reach out through our social media channels or send us a WhatsApp
        message — we’re always happy to chat!
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* WhatsApp */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
          >
            <FaWhatsapp size={20} />
            <span>WhatsApp</span>
          </Link>
        </motion.div>

        {/* Facebook */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={socialMedia[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaFacebook size={24} />
            <span>Facebook</span>
          </Link>
        </motion.div>

        {/* Instagram */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={socialMedia[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-pink-500 transition-colors"
          >
            <FaInstagram size={24} />
            <span>Instagram</span>
          </Link>
        </motion.div>

        {/* TikTok */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={socialMedia[2].url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <FaTiktok size={24} />
            <span>TikTok</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default SocialMediaSection;
