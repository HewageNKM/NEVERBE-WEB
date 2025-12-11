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

      <main className="relative z-10 text-center max-w-lg mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
          neverbe<span className="text-primary">.</span>
        </h1>

        <h2 className="text-2xl font-light text-gray-300 mb-4">
          We are currently upgrading our systems.
        </h2>

        <p className="text-gray-500 mb-8">
          We'll be back shortly with a better experience. Thank you for your
          patience.
        </p>

        <div className="flex items-center justify-center space-x-4">
          <a
            href="mailto:support@neverbe.com"
            className="text-sm text-white flex items-center gap-2 group hover:text-primary transition-transform active:scale-95"
          >
            Contact Support
            <span className="transition-transform group-hover:translate-x-1">
              <FaArrowRight size={16} />
            </span>
          </a>
        </div>
      </main>

      <footer className="absolute bottom-8 text-gray-600 text-xs text-center w-full">
        &copy; {new Date().getFullYear()} neverbe. All rights reserved.
      </footer>
    </div>
  );
}
