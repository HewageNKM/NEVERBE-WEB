"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Link from "next/link";

const SeasonalPromo = ({
  season,
}: {
  season: "christmas" | "newYear" | null;
}) => {
  if (!season) return null;

  // Editorial Style Copy (Less Emojis, More Hype)
  const christmasOffers = [
    {
      text: "HOLIDAY SALE: UP TO 50% OFF SELECTED STYLES",
      link: "/collections/deals",
    },
    {
      text: "FREE SHIPPING ON ORDERS OVER LKR 10,000",
      link: "/collections/products",
    },
    {
      text: "GIFT GUIDE: THE PERFECT PAIR FOR EVERYONE",
      link: "/collections/products",
    },
    { text: "EXTENDED RETURNS UNTIL JANUARY 15TH", link: "/pages/returns" },
  ];

  const newYearOffers = [
    {
      text: "START FRESH: NEW YEAR COLLECTION LIVE NOW",
      link: "/collections/new-arrivals",
    },
    { text: "LIMITED TIME: BUY 2 GET 10% OFF", link: "/collections/deals" },
    { text: "STEP INTO 2026 WITH STYLE", link: "/collections/products" },
  ];

  const offers = season === "christmas" ? christmasOffers : newYearOffers;

  // Sophisticated Color Palette
  const bgClass =
    season === "christmas"
      ? "bg-[#900000] text-white" // Deep Crimson
      : "bg-black text-white"; // Sleek Black for New Year

  return (
    <div className={`w-full ${bgClass} relative z-50`}>
      <div className="max-w-[1440px] mx-auto px-4">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-9" // Fixed height for stability
        >
          {offers.map((offer, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center h-full"
            >
              <Link
                href={offer.link}
                className="flex items-center justify-center h-full w-full"
              >
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] hover:underline hover:text-gray-200 transition-colors cursor-pointer text-center">
                  {offer.text}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SeasonalPromo;
