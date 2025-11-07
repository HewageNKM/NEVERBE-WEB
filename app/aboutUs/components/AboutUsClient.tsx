"use client";
import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const AboutUsClient = () => {
  return (
    <motion.section
      className="lg:pt-32 pt-12 md:pt-16 w-full"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div
        className="relative w-full bg-gradient-to-r from-primary-100 to-indigo-600 text-white py-24 px-6 md:px-20 rounded-b-3xl shadow-lg"
        variants={fadeUp}
      >
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="md:text-5xl text-4xl font-display font-bold mb-2 drop-shadow-lg">
            About NEVERBE
          </h1>
          <p className="text-lg md:text-xl drop-shadow-sm">
            Your trusted destination for premium copy shoes in Sri Lanka,
            redefining style and affordability.
          </p>
        </div>
      </motion.div>

      {/* Content Sections */}
      <motion.div className="bg-gray-100 py-16 px-6 md:px-20" variants={fadeUp}>
        <motion.div
          className="max-w-6xl mx-auto space-y-12"
          variants={container}
        >
          {/* Who We Are */}
          <motion.section
            className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
            variants={fadeUp}
          >
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At NEVERBE, we take pride in offering high-quality replicas of
              globally renowned shoe brands. Our commitment is to bring
              unparalleled style and comfort to every customer while maintaining
              affordable prices. Whether you&apos;re looking for everyday
              essentials or statement footwear, we&apos;ve got you covered.
            </p>
          </motion.section>

          {/* Mission & Vision */}
          <motion.section
            className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
            variants={fadeUp}
          >
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-4">
              Our Mission & Vision
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Our mission is simple: to provide top-notch replica shoes that
                blend durability, design, and value. We believe that style
                should be accessible to all, regardless of budget.
              </p>
              <p>
                Our vision is to lead the replica shoe market in Sri Lanka with
                a focus on ethical practices, outstanding customer service, and
                unwavering quality.
              </p>
            </div>
          </motion.section>

          {/* Why Choose Us */}
          <motion.section
            className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
            variants={fadeUp}
          >
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-8 text-center">
              Why Choose NEVERBE?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Affordable Luxury",
                  desc: "Experience premium designs without breaking the bank.",
                },
                {
                  title: "Extensive Collection",
                  desc: "A diverse range of styles to suit every occasion.",
                },
                {
                  title: "Reliable Shipping",
                  desc: "Fast, secure delivery across Sri Lanka.",
                },
                {
                  title: "Exceptional Support",
                  desc: "Dedicated customer service for all your queries.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  variants={fadeUp}
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default AboutUsClient;
