"use client";
import Image from "next/image";
import { Slide } from "@/interfaces/Slide";
import { Carousel } from "antd";
import { forwardRef } from "react";
import type { CarouselRef } from "antd/es/carousel";

interface ImagesSliderProps {
  images: Slide[];
  afterChange?: (current: number) => void;
}

const ImagesSlider = forwardRef<CarouselRef, ImagesSliderProps>(
  ({ images, afterChange }, ref) => {
    return (
      <Carousel
        ref={ref}
        autoplay
        autoplaySpeed={6000}
        effect="fade"
        afterChange={afterChange}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="w-full h-full bg-gray-900 block overflow-hidden"
          >
            <div className="relative w-full h-[60vh] md:h-[88vh]">
              <Image
                src={image.url}
                alt="NEVERBE Hero"
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </Carousel>
    );
  },
);

ImagesSlider.displayName = "ImagesSlider";

export default ImagesSlider;
