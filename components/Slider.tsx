import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';


// import required modules
import { Pagination, Navigation,EffectFade,FreeMode,Autoplay } from 'swiper/modules';

export default function Slider({images}) {
    return (
        <>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    type: 'fraction',
                }}
                effect={'fade'}
                navigation={true}
                modules={[Autoplay ,FreeMode,Navigation,EffectFade]}
                className="w-full rounded"
            >
                {images.map((image, index) => (
                    <div key={index}>
                        <SwiperSlide key={index}>
                            <img src={image.slideUrl} alt={image.alt} className="w-full h-[80vh] bg-cover"/>
                        </SwiperSlide>
                    </div>
                ))}
            </Swiper>
        </>
    );
}
