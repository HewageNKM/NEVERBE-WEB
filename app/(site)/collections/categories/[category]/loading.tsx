"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "LACING UP THE PIXELS...",
  "SEARCHING FOR THE PERFECT FIT...",
  "POLISHING THE LEATHER...",
  "LOOKING FOR THE OTHER SOCK...",
  "TYING UP LOOSE ENDS...",
  "RUNNING TO THE SERVER...",
  "BREAKING IN THE NEW CODE...",
  "SOLE SEARCHING...",
  "CHECKING THE TREAD DEPTH...",
];

const Loading = () => {
  const dots = Array.from({ length: 3 }); // Reduced to 3 for a cleaner look
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white gap-6">
      {/* Dots Animation - Sleek Black */}
      <div className="flex items-center gap-3">
        {dots.map((_, index) => (
          <motion.div
            key={index}
            className="h-3 w-3 rounded-full bg-black"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>

      {/* Text Animation - Uppercase & Bold */}
      <div className="h-6 relative flex items-center justify-center w-full px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMsgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-black text-xs md:text-sm font-bold uppercase tracking-[0.2em] absolute text-center"
          >
            {loadingMessages[currentMsgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default Loading;
