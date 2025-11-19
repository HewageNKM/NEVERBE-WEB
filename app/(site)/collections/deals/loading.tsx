"use client";

import { motion } from "framer-motion";

const Loading = () => {
  const dots = Array.from({ length: 5 }); // More dots for a smooth wave

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex items-center space-x-2">
        {dots.map((_, index) => (
          <motion.div
            key={index}
            className="h-5 w-5 rounded-full bg-primary"
            animate={{
              y: [0, -12, 0],         // smooth bounce
              scale: [1, 1.3, 1],     // subtle scale for fluid effect
              opacity: [0.7, 1, 0.7], // fade for depth
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.15,     // stagger for wave
            }}
          />
        ))}
      </div>
    </main>
  );
};

export default Loading;
