"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { IoChevronBack, IoChevronForward, IoStar } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

// Static testimonial data - can be replaced with API data later
const reviews = [
  {
    id: 1,
    name: "Kavindi Perera",
    rating: 5,
    text: "Amazing quality shoes! Delivery was super fast and the packaging was premium. Definitely buying again!",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Ashan Fernando",
    rating: 5,
    text: "Best shoe store in Sri Lanka. The sneakers I ordered are exactly as shown in the pictures. Very happy customer!",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Dilini Jayawardena",
    rating: 5,
    text: "Customer service is exceptional. They helped me find the perfect size and the exchange process was hassle-free.",
    date: "3 weeks ago",
  },
  {
    id: 4,
    name: "Nuwan Silva",
    rating: 4,
    text: "Great variety of shoes at reasonable prices. Cash on delivery option is very convenient. Highly recommend!",
    date: "1 month ago",
  },
  {
    id: 5,
    name: "Tharushi Mendis",
    rating: 5,
    text: "Ordered running shoes for my husband. He loves them! Will definitely recommend NEVERBE to friends and family.",
    date: "2 months ago",
  },
  {
    id: 6,
    name: "Chamara Rathnayake",
    rating: 5,
    text: "The combos offer is amazing value for money. Got two pairs for the price of one. Quality is top-notch!",
    date: "1 month ago",
  },
];

const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => {
  // Generate initials from name
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header with Avatar and Google badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar with initials */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <div>
            <p className="font-bold text-sm">{review.name}</p>
            <p className="text-xs text-gray-400">{review.date}</p>
          </div>
        </div>
        <FcGoogle size={20} />
      </div>

      {/* Star Rating */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <IoStar
            key={i}
            size={16}
            className={i < review.rating ? "text-yellow-400" : "text-gray-200"}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-sm text-gray-600 leading-relaxed flex-1">
        "{review.text}"
      </p>
    </div>
  );
};

const CustomerReviews = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-16">
      {/* Header with Google Rating Badge */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FcGoogle size={28} />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <IoStar key={i} size={18} className="text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-bold">4.9</span>
            <span className="text-sm text-gray-400">based on 200+ reviews</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            Real reviews from real customers across Sri Lanka
          </p>
        </div>

        {/* Navigation Arrows - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
            aria-label="Previous review"
          >
            <IoChevronBack size={18} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all"
            aria-label="Next review"
          >
            <IoChevronForward size={18} />
          </button>
        </div>
      </div>

      {/* Reviews Slider */}
      <Swiper
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={20}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="!pb-4"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Google Reviews CTA */}
      <div className="flex justify-center mt-8">
        <a
          href="https://g.page/r/neverbe/review"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-bold uppercase tracking-wider transition-colors"
        >
          <FcGoogle size={20} />
          Leave us a review on Google
        </a>
      </div>
    </section>
  );
};

export default CustomerReviews;
