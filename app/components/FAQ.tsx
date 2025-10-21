"use client";
import React from "react";
import { faqs } from "@/constants";
import FaqCard from "@/app/components/FAQCard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const Faq = () => {
  return (
    <section className="w-full mt-10 lg:px-16 px-2 py-4" aria-labelledby="faq-section">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-8"
      >
        <h2 id="faq-section" className="md:text-4xl font-display text-2xl font-bold">
          <strong>FAQ</strong>
        </h2>
        <h3 className="text-lg md:text-xl text-primary mt-2">
          Frequently Asked Questions
        </h3>
      </motion.div>

      {/* FAQ Cards */}
      <motion.div className="p-8">
        <motion.ul
          className="flex flex-row flex-wrap justify-center gap-10 mt-10 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          role="list"
        >
          {faqs.map((faq, index) => (
            <motion.li key={index} variants={itemVariants} role="listitem">
              <FaqCard index={index} faq={faq} />
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
};

export default Faq;
