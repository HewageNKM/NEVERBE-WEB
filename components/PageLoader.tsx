"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "LACING UP THE PIXELS",
  "SEARCHING FOR THE PERFECT FIT",
  "POLISHING THE LEATHER",
  "PREPARING YOUR GEAR",
  "TYING UP LOOSE ENDS",
  "RUNNING TO THE SERVER",
  "BREAKING IN THE NEW CODE",
  "SOLE SEARCHING",
  "CHECKING THE TREAD DEPTH",
];

/**
 * PageLoader - Nike Aesthetic Redesign
 * Focuses on high-precision lines, medium weights, and snappy transitions.
 */
const PageLoader = () => {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white transition-colors duration-500">
      {/* 1. HIGH-PRECISION TECHNICAL SPINNER */}
      <div className="relative flex items-center justify-center mb-10">
        {/* Outer subtle ring */}
        <div className="w-16 h-16 rounded-full border-[1px] border-gray-100" />

        {/* Active high-speed spinner */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-[1.5px] border-[#111] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.6,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Inner subtle pulse */}
        <motion.div
          className="absolute w-12 h-12 rounded-full bg-surface-2"
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 2. SOPHISTICATED TYPOGRAPHY */}
      <div className="h-8 relative flex items-center justify-center w-full max-w-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMsgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1], // Custom Nike-style cubic bezier
            }}
            className="absolute flex flex-col items-center gap-1"
          >
            <p className="text-primary text-[13px] font-medium uppercase tracking-[0.25em] text-center">
              {loadingMessages[currentMsgIndex]}
            </p>

            {/* Minimalist progress indicator */}
            <div className="flex gap-1.5 mt-2">
              {loadingMessages.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] transition-all duration-500 ${
                    i === currentMsgIndex ? "w-4 bg-dark" : "w-1 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. BRAND LOGO MARK (Optional) */}
      <div className="absolute bottom-12 opacity-10 grayscale">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase">
          Neverbe Inc.
        </p>
      </div>
    </main>
  );
};

export default PageLoader;
