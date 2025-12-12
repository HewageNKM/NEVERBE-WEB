"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import { Slide } from "@/interfaces";

const ImagesSlider = ({ images }: { images: Slide[] }) => {
  return (
    <Swiper
      autoplay={{
        delay: 6000,
        disableOnInteraction: false,
      }}
      effect="fade"
      modules={[EffectFade, Autoplay]}
      className="w-full h-full"
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.id} className="w-full h-full bg-gray-900">
          <div className="relative w-full h-full">
            <Image
              src={image.url}
              alt="NEVERBE Hero"
              fill
              className="object-cover object-center"
              priority={index === 0}
            />
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImagesSlider;
