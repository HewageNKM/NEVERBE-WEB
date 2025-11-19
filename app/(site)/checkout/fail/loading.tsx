"use client";

import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center space-y-6">
        {/* Next.js-like rotating ring */}
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-700" />
          <div className="absolute inset-0 rounded-full border-t-4 border-t-primary border-transparent" />
        </motion.div>

        {/* Label */}
        <motion.p
          className="text-sm font-medium tracking-wider text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          Loading<span className="animate-pulse">...</span>
        </motion.p>
      </div>
    </main>
  );
};

export default Loading;
