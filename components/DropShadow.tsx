"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface DropShadowProps {
  containerStyle?: string;
  children: ReactNode;
  onClick?: () => void;
  variant?: "light" | "dark";
}

const DropShadow = ({
  containerStyle,
  children,
  onClick,
  variant = "light",
}: DropShadowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "circOut" }}
      onClick={onClick}
      className={`fixed inset-0 z-100 flex transition-all ${
        variant === "light"
          ? "bg-white/80 backdrop-blur-md"
          : "bg-black/40 backdrop-blur-sm"
      } ${containerStyle || ""}`}
    >
      {/* The variant="light" is the signature Nike Look. 
          It allows the product context to stay visible but softly diffused.
      */}
      {children}
    </motion.div>
  );
};

export default DropShadow;
