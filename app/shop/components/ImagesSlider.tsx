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
                    <SwiperSlide key={index}>
                        <figure>
                            <Image src={image.url} alt={image.fileName} width={1980}
                                   height={1080} />
                        </figure>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default ImagesSlider;