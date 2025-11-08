"use client";
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
    <section className="w-full lg:mt-32 mt-14 md:mt-24 flex flex-col gap-8">
      {/* Main Slider */}
      <ImagesSlider images={slides} />

      {/* Collections Slider */}
      <div className="lg:px-8 px-2 py-4">
        <div className="flex flex-col gap-6">
          <h3 className="text-gray-800 font-display text-2xl md:text-4xl font-bold tracking-tight text-center md:text-left">
            Explore Our Collection
          </h3>

          <div className="md:max-w-6xl max-w-full mx-auto px-2 sm:px-4">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              centeredSlides={true}
              slidesPerView={1.4}
              breakpoints={{
                640: { slidesPerView: 2, centeredSlides: true },
                1024: { slidesPerView: 3, centeredSlides: true },
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              pagination={{
                dynamicBullets: true,
                clickable: true,
                el: ".custom-pagination",
              }}
              className="pb-6"
            >
              {collectionList.map((collection, idx) => (
                <SwiperSlide
                  key={idx}
                  className="flex justify-center items-center"
                >
                  <CollectionCard
                    url={collection.url}
                    label={collection.label}
                    image={collection.image}
                  />
                </SwiperSlide>
              ))}

              {/* Custom Pagination Container */}
              <div className="custom-pagination mb-1 flex justify-center gap-3 mt-4"></div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
