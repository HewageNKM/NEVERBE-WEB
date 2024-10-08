"use client"
import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import {Pagination, Autoplay} from 'swiper/modules';
import Image from "next/image";
import {Slide} from "@/interfaces";

const ImagesSlider = ({images}: { images: Slide[] }) => {
    return (
        <>
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
                                <source srcSet={image.urls.mobile} type="image/png" media="(max-width: 640px)"/>
                                <Image width={1920} height={1080} src={image.urls.default} alt={image.fileName} className="w-full h-full"/>
                            </picture>
                        </figure>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default ImagesSlider;