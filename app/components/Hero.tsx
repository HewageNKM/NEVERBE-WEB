"use client";
import React, { useRef } from "react";
import ImagesSlider from "@/app/components/ImagesSlider";
import Link from "next/link";
import { Slide } from "@/interfaces";
import { collectionList } from "@/constants";
import CollectionCard from "@/app/components/CollectionCard";
import { FaCartPlus } from "react-icons/fa6";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Hero = ({ slides }: { slides: Slide[] }) => {
  return (
    <section className="w-full mt-16 lg:mt-[7rem] flex flex-col gap-8">
      {/* Main Slider */}
      <ImagesSlider images={slides} />

      {/* Collections Slider */}
      <div className="px-4 lg:px-8">
        <div className="flex flex-col gap-6">
          <h3 className="text-gray-800 font-display text-2xl md:text-4xl font-bold tracking-tight">
            Explore Our Collection
          </h3>

          <div className="md:max-w-6xl max-w-full mx-auto px-4">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1} 
              centeredSlides={true}
              breakpoints={{
                640: { slidesPerView: 2, centeredSlides: true }, // tablet
                1024: { slidesPerView: 3, centeredSlides: true }, // desktop
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              pagination={{
                clickable: true,
                el: ".custom-pagination"
              }}
            >
              {collectionList.map((collection, idx) => (
                <SwiperSlide
                  key={idx}
                  className="flex justify-center content-center"
                >
                  <CollectionCard
                    url={collection.url}
                    gender={collection.gender}
                    image={collection.image}
                  />
                </SwiperSlide>
              ))}
              {/* Custom Pagination Container */}
              <div
                className="custom-pagination flex justify-center gap-3 mb-2 mt-4"
              ></div>
            </Swiper>
          </div>

          {/* Shop All Button */}
          <div className="flex justify-center mt-2">
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
