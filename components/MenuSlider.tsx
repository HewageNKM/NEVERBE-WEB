import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store";

export default function MenuSlider({ menu }) {
    const showNav = useSelector((state: RootState) => state.headerSlice.showNav);

    return (
        <Swiper
            modules={[Navigation]}
            slidesPerView={5}
            style={{
                position:"relative",
                // @ts-ignore
                '--swiper-navigation-color': '#000000'
            }}
            navigation={showNav}
            freeMode={true}
            className="w-[50vw]"
        >
            {menu.map((item, index) => (
                <SwiperSlide
                    key={index}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Link href="">
                        <p className="text-black line-clamp-1 w-fit h-[1.6rem] text-xl font-bold">{item.title}</p>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
