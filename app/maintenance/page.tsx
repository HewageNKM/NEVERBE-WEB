"use client";
import "@/app/globals.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <main className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col items-center text-center">
        {/* Brand Name - Massive & Bold */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-8"
        >
          Neverbe
        </motion.h1>

        {/* Animated Line - "Loading" feel */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="w-full max-w-xs h-1 bg-gray-100 overflow-hidden mb-10"
        >
          <motion.div
            className="h-full bg-black w-full origin-left"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4 max-w-md"
        >
          <h2 className="text-lg font-bold uppercase tracking-widest">
            System Upgrade In Progress
          </h2>
          <p className="text-gray-500 font-medium text-sm leading-relaxed">
            We are currently updating our store to bring you a better shopping
            experience. We will be back online shortly.
          </p>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12"
        >
          <a
            href="mailto:support@neverbe.lk"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:text-gray-600 transition-all"
          >
            Contact Support
            <span className="group-hover:translate-x-1 transition-transform">
              <FaArrowRightLong size={14} />
            </span>
          </a>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 w-full text-center">
        <p className="text-[10px] font-bold uppercase text-gray-300 tracking-widest">
          &copy; {new Date().getFullYear()} NEVERBE. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
