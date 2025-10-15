"use client";
import React from "react";
import { ContactUs } from "@/constants";
import { motion } from "framer-motion";

const MapSection = () => {
  return (
    <motion.section
      className="w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.15 }}
    >
      <motion.h2
        className="text-2xl font-semibold text-gray-900 mb-4 font-display"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Visit Our Store
      </motion.h2>

      <motion.div
        className="w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <iframe
          src={ContactUs.embeddedMap}
          loading="lazy"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.div>
    </motion.section>
  );
};

export default MapSection;
