"use client";
import ImagesSlider from "@/app/(site)/components/ImagesSlider";
import { Slide } from "@/interfaces";
import { collectionList } from "@/constants";
import CollectionCard from "@/app/(site)/components/CollectionCard";
import { FaCartPlus } from "react-icons/fa6";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import "swiper/css";
import "swiper/css/navigation";

const Hero = ({ slides }: { slides: Slide[] }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const handleInit = (swiper: SwiperType) => {
    if (
      swiper.params.navigation &&
      typeof swiper.params.navigation !== "boolean"
    ) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  };

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

          <div className="md:max-w-6xl max-w-full mx-auto px-2 sm:px-4 relative group">
            {/* Custom Navigation Buttons */}
            <button
              ref={prevRef}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <BiChevronLeft size={24} />
            </button>
            <button
              ref={nextRef}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <BiChevronRight size={24} />
            </button>

            <Swiper
              modules={[Navigation]}
              onInit={handleInit}
              spaceBetween={20}
              centeredSlides={true}
              slidesPerView={1.4}
              breakpoints={{
                640: { slidesPerView: 2, centeredSlides: true },
                1024: { slidesPerView: 3, centeredSlides: true },
              }}
              loop={true}
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
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
