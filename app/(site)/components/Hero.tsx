"use client";
import ImagesSlider from "@/app/(site)/components/ImagesSlider";
import { Slide } from "@/interfaces/BagItem";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = ({ slides }: { slides: Slide[] }) => {
  return (
    <section className="w-full relative">
      {/* Full Width Slider */}
      <div className="w-full h-[60vh] md:h-[85vh] relative">
        <ImagesSlider images={slides} />

        {/* Hero Overlay Text (Optional - if your images don't have text) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-12 md:pb-24 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4 pointer-events-auto"
          >
            <h1 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter drop-shadow-lg italic">
              Just Dropped
            </h1>
            <div className="flex gap-4 justify-center">
              <Link
                href="/collections/products"
                className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
