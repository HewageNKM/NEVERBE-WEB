"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DefaultBG } from "@/assets/images";

const CategoryHeader = ({ category }: { category: string }) => {
  const title =
    category && category !== "all"
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "All Categories";

  return (
    <section className="relative w-full overflow-hidden">
      <motion.figure
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-48 md:h-88 relative"
      >
        <Image
          src={DefaultBG}
          alt={`${title} Banner`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent" />
      </motion.figure>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-3xl font-display md:text-5xl font-bold text-white drop-shadow-md">
          {title}
        </h1>
        <p className="mt-2 text-gray-200 text-sm md:text-lg">
          Explore all products under {title.toLowerCase()}.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-5 h-1.5 w-16 rounded-full bg-primary/80"
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white/80 to-transparent backdrop-blur-[2px]" />
    </section>
  );
};

export default CategoryHeader;
