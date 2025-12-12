"use client";
import ItemCard from "@/components/ItemCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const NewArrivals = ({ arrivals }: { arrivals: any[] }) => {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          New Arrivals
        </h2>
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1.5} // Shows part of next slide to encourage scroll
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4.2 },
        }}
        className="pb-10!"
      >
        {arrivals.map((item, index) => (
          <SwiperSlide key={item.id}>
            <ItemCard item={item} priority={index < 4} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
export default NewArrivals;
