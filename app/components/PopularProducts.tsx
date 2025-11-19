"use client";

import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { motion } from "framer-motion";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Product } from "@/interfaces/Product";

const PopularProducts = ({ hotItems }: { hotItems: Product[] }) => {
  if (hotItems.length === 0) {
    return <EmptyState heading="No hot products available!" />;
  }

  return (
    <section className="w-full my-8">
      <div className="lg:px-16 px-2 py-4">
        {/* Header */}
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-display md:text-4xl font-bold text-gray-800">
            Popular Products
          </h2>
          <h3 className="text-primary text-lg md:text-xl mt-2 font-medium">
            Check out our best-selling products
          </h3>
        </motion.div>

        {/* Swiper Slider */}
        <div className="mt-10">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={hotItems.length > 1}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
            }}
          >
            {hotItems.map((item) => (
              <SwiperSlide
                key={item.id}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ItemCard item={item} />
                </motion.div>
              </SwiperSlide>
            ))}

            {/* Custom Pagination */}
            <div className="custom-pagination mt-5 mb-2 flex justify-center gap-3"></div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
