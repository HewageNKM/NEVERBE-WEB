"use client";
// Clean imports
import Image from "next/image";
import { Slide } from "@/interfaces/BagItem";

import { Carousel } from "antd";

const ImagesSlider = ({ images }: { images: Slide[] }) => {
  return (
    <Carousel
      autoplay
      autoplaySpeed={6000}
      effect="fade"
      className="w-full h-full"
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          className="w-full h-full bg-gray-900 block overflow-hidden"
        >
          <div className="relative w-full h-[60vh] md:h-[85vh]">
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
        </div>
      ))}
    </Carousel>
  );
};

export default ImagesSlider;
