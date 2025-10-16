"use client";
import React from "react";
import { contactInfo } from "@/constants";
import Link from "next/link";
import { motion } from "framer-motion";

const ContactDetailsSection = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-2xl font-semibold text-gray-900 font-display"
        variants={itemVariants}
      >
        Reach Us At
      </motion.h2>

      <motion.ul className="flex flex-col gap-4" variants={containerVariants}>
        {contactInfo.map((info, idx) => (
          <motion.li key={idx} variants={itemVariants}>
            <Link
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors"
            >
              <info.icon
                size={24}
                className="text-gray-500 transition-transform duration-200 hover:scale-110"
              />
              <span className="text-lg">{info.content}</span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <motion.p
        className="text-gray-600 text-sm leading-relaxed max-w-md"
        variants={itemVariants}
      >
        You can contact us via email for any inquiries, support requests, or
        partnership opportunities. We typically respond within 24 hours.
      </motion.p>
    </motion.section>
  );
};

export default ContactDetailsSection;
