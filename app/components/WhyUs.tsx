"use client";
import React from "react";
import Image from "next/image";
import { whyUs } from "@/constants";
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
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

const WhyUs = () => {
  return (
    <motion.section 
      className="w-full bg-gray-50 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto lg:px-16 px-2 py-4 space-y-8">
        {/* Header */}
        <motion.header 
          className="text-center space-y-2"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold">Why Choose Us?</h2>
          <p className="text-primary text-lg md:text-xl">
            We are the best in the business
          </p>
        </motion.header>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyUs.map((item, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6"
              variants={itemVariants}
            >
              <figure className="flex flex-col items-center mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={120}
                  height={120}
                  className="w-24 h-24 md:w-28 md:h-28 object-contain"
                  loading="lazy"
                />
                <figcaption className="mt-3 font-semibold text-lg text-gray-800">
                  {item.title}
                </figcaption>
              </figure>
              <p className="text-gray-600 text-sm md:text-base font-light leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WhyUs;
