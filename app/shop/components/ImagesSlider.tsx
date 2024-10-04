"use client"
import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import {Pagination} from 'swiper/modules';
import Image from "next/image";
import {Slide} from "@/interfaces";

const ImagesSlider = ({images}: { images: Slide[] }) => {
    return (
        <>
            <Swiper
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="w-full relative"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Image src={image.url} alt={image.fileName} width={1980} height={750} className="w-full bg-auto h-fit"/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default ImagesSlider;