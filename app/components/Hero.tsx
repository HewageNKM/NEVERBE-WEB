"use client";
import React, { useState, useEffect } from "react";
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import { Slide } from "@/interfaces";
import { collectionList } from "@/constants";
import CollectionCard from "@/app/components/CollectionCard";
import { FaCartPlus } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const COLLECTIONS_PER_PAGE = 3; // Number of collections per slide

const Hero = ({ slides }: { slides: Slide[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [collectionsPerPage, setCollectionsPerPage] = useState(1);

  // Responsive collections per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCollectionsPerPage(1);
      else if (window.innerWidth < 768) setCollectionsPerPage(2);
      else if (window.innerWidth < 1024) setCollectionsPerPage(3);
      else setCollectionsPerPage(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(collectionList.length / collectionsPerPage);
  const startIndex = (currentPage - 1) * collectionsPerPage;
  const currentCollections = collectionList.slice(
    startIndex,
    startIndex + collectionsPerPage
  );

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const handleDotClick = (page: number) => setCurrentPage(page);

  return (
    <section className="w-full mt-16 lg:mt-[7rem] flex flex-col gap-8">
      {/* Slider */}
      <ImagesSlider images={slides} />

      {/* Collections Slider */}
      <div className="px-4 lg:px-8">
        <div className="flex flex-col gap-6">
          <h3 className="text-gray-800 font-display text-2xl md:text-4xl font-bold tracking-tight">
            Explore Our Collection
          </h3>

          <div className="relative mt-6">
            <AnimatePresence mode="wait">
              <motion.ul
                key={currentPage}
                className="flex justify-center gap-6 md:gap-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {currentCollections.map((collection, idx) => (
                  <li key={idx} className="flex-shrink-0 w-64 md:w-72">
                    <CollectionCard
                      url={collection.url}
                      gender={collection.gender}
                      image={collection.image}
                    />
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i + 1)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === i + 1
                      ? "bg-primary scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Shop All Button */}
          <div className="flex justify-center mt-1">
            <Link
              href="/collections/products"
              className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-400 transition-all shadow-md hover:shadow-lg font-medium text-lg"
            >
              <FaCartPlus size={24} className="mr-2" />
              Shop All
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
