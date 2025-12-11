"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const SeasonalPromo = ({
  season,
}: {
  season: "christmas" | "newYear" | null;
}) => {
  if (!season) return null;
  const christmasOffers = [
    "🎄 Christmas Sale! Up to 50% OFF on selected items!",
    "🎅 Ho Ho Ho! Free shipping on orders over Rs. 10000!",
    "🎁 Gift your loved ones the perfect pair of shoes this Christmas!",
    "🌟 Festive deals on all footwear categories!",
    "🔔 Limited-time Christmas bundles available!",
  ];

  const newYearOffers = [
    "🎆 Happy New Year! exclusive New Year discounts available!",
    "✨ Celebration Sale! Buy 2 get 10% OFF!",
    "🎇 Step into the New Year with style! New arrivals in stock!",
    "🎉 Ring in the New Year with fresh kicks!",
    "🗓️ Start the year right with our amazing deals!",
  ];

  const offers = season === "christmas" ? christmasOffers : newYearOffers;
  const bgColor = season === "christmas" ? "bg-red-600" : "bg-orange-500"; // Christmas Red, New Year Orange/Gold

  return (
    <div className={`w-full ${bgColor} text-white py-2`}>
      <div className="max-w-7xl mx-auto px-4 text-center text-sm md:text-base font-medium">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-6"
        >
          {offers.map((offer, index) => (
            <SwiperSlide key={index}>
              <p>{offer}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SeasonalPromo;
