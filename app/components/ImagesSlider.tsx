"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
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
                dynamicBullets: true,
            }}
            modules={[Pagination, Autoplay]}
            className="w-full relative"
        >
            {images.map((image, index) => (
                <SwiperSlide key={index} className="w-full">
                    <figure className="w-full h-full">
                        <picture>
                            <source srcSet={image.urls.mobile} type="image/png" media="(max-width: 640px)" />
                            <Image
                                width={1920}
                                height={1080}
                                src={image.urls.default}
                                alt={image.fileName || 'Image slideshow'} // Use a fallback if fileName is not available
                                className="w-full h-full"
                                loading="lazy" // Lazy load images
                            />
                        </picture>
                        {/* Optional caption for better semantics */}
                        {/* <figcaption className="text-center text-sm mt-2">{image.caption}</figcaption> */}
                    </figure>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ImagesSlider;
