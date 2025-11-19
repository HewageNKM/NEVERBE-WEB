"use client";

import React from "react";
import { motion } from "framer-motion";
import ShippingReturnPolicyContent from "./ShippingReturnPolicyContent";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ShippingReturnPolicyClient = () => {
  return (
    <motion.main
      className="w-full lg:mt-32 md:mt-16 mt-20 min-h-screen lg:px-48 md:px-24 px-8 py-16"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="lg:text-6xl md:text-5xl text-3xl font-extrabold text-gray-900 tracking-wide text-center mb-12"
        variants={fadeUp}
      >
        Shipping, Returns & Exchange Policy
      </motion.h1>

      <motion.div variants={fadeUp}>
        <ShippingReturnPolicyContent />
      </motion.div>
      
    </motion.main>
  );
};

export default ShippingReturnPolicyClient;
