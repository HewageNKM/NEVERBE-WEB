"use client";
import React from "react";
import { Item } from "@/interfaces";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
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

const NewArrivals = ({ arrivals }: { arrivals: Item[] }) => {
  return (
    <section className="w-full my-16">
      <div className="lg:px-24 px-4 w-full">
        {/* Header */}
        <motion.div 
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-800">
            New Arrivals
          </h2>
          <h3 className="text-primary text-lg md:text-xl mt-2 font-medium">
            Check out our latest products
          </h3>
        </motion.div>

        {/* Products */}
        <div className="mt-10">
          {arrivals.length > 0 ? (
            <motion.ul 
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {arrivals.map((item: Item) => (
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
            <div className="mt-8">
              <EmptyState heading="No new arrivals" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
