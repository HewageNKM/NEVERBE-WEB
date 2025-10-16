"use client";
import React from "react";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { Item } from "@/interfaces";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const PopularProducts = ({ hotItems }: { hotItems: Item[] }) => {
  return (
    <section className="w-full my-16">
      <div className="lg:px-24 px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-display md:text-4xl font-bold text-gray-800">
            Popular Products
          </h2>
          <h3 className="text-primary text-lg md:text-xl mt-2 font-medium">
            Check out our best-selling products
          </h3>
        </motion.div>

        {/* Products List */}
        <div className="mt-10 flex justify-center">
          {hotItems.length > 0 ? (
            <motion.ul 
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {hotItems.map((item: Item) => (
                <motion.li
                  key={item.itemId}
                  className="transition-transform duration-300 hover:scale-105"
                  variants={itemVariants}
                >
                  <ItemCard item={item} />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <EmptyState heading="No hot products available!" />
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
