"use client";

import React from "react";
import { motion } from "framer-motion";
import PrivacyPolicyContent from "./PrivacyPolicyContent";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const PrivacyPolicyClient = () => {
  return (
    <motion.main
      className="privacy-policy w-full lg:mt-32 mt-24 max-w-4xl mx-auto pt-10 p-4 sm:p-6 md:p-8"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-900 font-display"
        variants={fadeUp}
      >
        Privacy Policy
      </motion.h1>

      <motion.div
        className="space-y-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <PrivacyPolicyContent />
      </motion.div>
    </motion.main>
  );
};

export default PrivacyPolicyClient;
