"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { Slide } from "@/interfaces";

const ImagesSlider = ({ images }: { images: Slide[] }) => {
  return (
    <Swiper
      autoplay={{
        delay: 5000,
        disableOnInteraction: true,
      }}
      pagination={{
        clickable: true,
        el: ".custom-pagination",
      }}
      modules={[Pagination, Autoplay]}
      className="w-full relative mt-5"
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.id} className="w-full">
          <figure className="w-full p-4">
            <div className="overflow-hidden rounded-2xl shadow-md">
              <Image
                width={1200}
                height={628}
                src={image.url}
                alt={"NEVERBE"}
                className="object-cover w-full"
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />
            </div>
          </figure>
        </SwiperSlide>
      ))}
      {/* Custom Pagination */}
      <div className="custom-pagination mt-3 mb-2 flex justify-center gap-3"></div>
    </Swiper>
  );
};

export default ImagesSlider;
