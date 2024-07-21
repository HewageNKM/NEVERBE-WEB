import React from 'react';

import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';


// import required modules
import {Autoplay, EffectFade, FreeMode, Navigation} from 'swiper/modules';
import Image from "next/image";

export default function Slider({images, imageStyles}: { images: object[], imageStyles: string }) {
    return (
        <>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
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
                modules={[Autoplay, FreeMode, Navigation, EffectFade]}
                className="w-full rounded"
            >
                {images.map((image, index) => (
                    <div key={index}>
                        <SwiperSlide key={index}>
                            <Image width={3000} height={3000} src={image.slideUrl} alt={`slide ${index}`}
                                   className={imageStyles}/>
                        </SwiperSlide>
                    </div>
                ))}
            </Swiper>
        </>
    );
}
