"use client";
import "@/app/globals.css";
import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function MaintenancePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Animated Background Decoration */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.main
        className="relative z-10 text-center max-w-lg mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          variants={itemVariants}
        >
          neverbe<span className="text-primary">.</span>
        </motion.h1>

        <motion.h2
          className="text-2xl font-light text-gray-300 mb-4"
          variants={itemVariants}
        >
          We are currently upgrading our systems.
        </motion.h2>

        <motion.p className="text-gray-500 mb-8" variants={itemVariants}>
          We'll be back shortly with a better experience. Thank you for your
          patience.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center space-x-4"
        >
          <motion.a
            href="mailto:support@neverbe.com"
            className="text-sm text-white flex items-center gap-2 group hover:text-primary"
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
            <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }}>
              <FaArrowRight size={16} />
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.main>

      <motion.footer
        className="absolute bottom-8 text-gray-600 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        &copy; {new Date().getFullYear()} neverbe. All rights reserved.
      </motion.footer>
    </div>
  );
}
