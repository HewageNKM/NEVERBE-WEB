"use client";
import { useEffect, useState } from "react";
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
 * PageLoader - NEVERBE Performance Redesign
 * High-precision motion, Vibrant Green accents, and performance typography.
 */
const PageLoader = () => {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-surface transition-colors duration-500">
      {/* 1. TECHNICAL PERFORMANCE SPINNER */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Outer subtle brand ring */}
        <div className="w-20 h-20 rounded-full border-[1px] border-border-primary" />

        {/* High-speed brand spinner */}
        <motion.div
          className="absolute w-20 h-20 rounded-full border-[2px] border-accent border-t-transparent shadow-[0_0_15px_rgba(151,225,62,0.3)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.5,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Inner Counter-rotating ring */}
        <motion.div
          className="absolute w-14 h-14 rounded-full border-[1px] border-dark border-b-transparent opacity-20"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
        />

        {/* Center performance dot */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_#97e13e]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      {/* 2. BRANDED TYPOGRAPHY & PROGRESS */}
      <div className="h-16 relative flex items-center justify-center w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMsgIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1], // Nike-style snappy cubic bezier
            }}
            className="absolute flex flex-col items-center gap-4"
          >
            <p className="text-primary font-display font-black text-lg md:text-xl uppercase italic tracking-tighter text-center">
              {loadingMessages[currentMsgIndex]}
            </p>

            {/* Performance Progress Indicator (Skewed Bars) */}
            <div className="flex gap-1">
              {loadingMessages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 transition-all duration-500 rounded-sm -skew-x-12 ${
                    i === currentMsgIndex
                      ? "w-8 bg-accent shadow-[0_0_8px_rgba(151,225,62,0.6)]"
                      : "w-2 bg-surface-3"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. FOOTER SIGNATURE */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-muted italic">
          Neverbe Performance Gear
        </p>
        <div className="w-12 h-px bg-accent/30" />
      </div>
    </main>
  );
};

export default PageLoader;
