"use client";
import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Autoplay, Pagination} from 'swiper/modules';
import Image from "next/image";
import {Slide} from "@/interfaces";

const ImagesSlider = ({images}: { images: Slide[] }) => {
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
            className="w-full relative mt-5"
        >
            {images.map((image) => (
                <SwiperSlide key={image.id} className="w-full">
                    <figure className="w-full h-full">
                        <Image
                            width={1200}
                            height={628}
                            src={image.url}
                            alt={image.fileName || 'Image slideshow'} // Use a fallback if fileName is not available
                            className="object-cover w-full"
                            loading="lazy" // Lazy load images
                        />
                    </figure>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ImagesSlider;
