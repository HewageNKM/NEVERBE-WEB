"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import {
  IoChevronBack,
  IoChevronForward,
  IoStar,
  IoSparkles,
} from "react-icons/io5";
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

// NEVERBE Performance Review Card
const ReviewCard = ({ review }: { review: (typeof reviews)[0] }) => {
  // Generate initials from name
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="group bg-surface border border-default rounded-2xl p-6 h-full flex flex-col shadow-custom hover:shadow-hover hover:border-accent transition-all duration-500 hover:-translate-y-1">
      {/* Header with Avatar and Google badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Performance Avatar - Accent Gradient */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#97e13e] to-[#6db82a] flex items-center justify-center text-dark font-display font-black text-sm shadow-[0_0_15px_rgba(151,225,62,0.4)]">
              {initials}
            </div>
            {/* Verified Badge */}
            {review.rating === 5 && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-dark rounded-full flex items-center justify-center">
                <IoSparkles size={10} className="text-accent" />
              </div>
            )}
          </div>
          <div>
            <p className="font-display font-black text-sm uppercase tracking-tight text-primary group-hover:text-accent transition-colors">
              {review.name}
            </p>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
              {review.date}
            </p>
          </div>
        </div>
        {/* Google Badge */}
        <div className="p-1.5 bg-surface-2 rounded-lg group-hover:bg-accent/10 transition-colors">
          <FcGoogle size={18} />
        </div>
      </div>

      {/* Star Rating - Performance Style */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`p-0.5 rounded ${
              i < review.rating ? "text-accent" : "text-surface-3"
            }`}
          >
            <IoStar
              size={14}
              className={
                i < review.rating
                  ? "drop-shadow-[0_0_4px_rgba(151,225,62,0.6)]"
                  : ""
              }
            />
          </div>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-sm text-secondary leading-relaxed flex-1 italic">
        "{review.text}"
      </p>

      {/* Bottom Accent Line */}
      <div className="mt-4 pt-4 border-t border-default">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted group-hover:text-accent transition-colors">
          Verified Purchase
        </span>
      </div>
    </div>
  );
};

const CustomerReviews = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="w-full max-w-content mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Header with Google Rating Badge */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div>
          {/* Rating Summary - Performance Style */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-full border border-default">
              <FcGoogle size={24} />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <IoStar
                    key={i}
                    size={14}
                    className="text-accent drop-shadow-[0_0_4px_rgba(151,225,62,0.4)]"
                  />
                ))}
              </div>
              <span className="text-lg font-display font-black italic text-primary">
                4.9
              </span>
            </div>
            <span className="text-xs text-muted font-bold uppercase tracking-wider">
              200+ Reviews
            </span>
          </div>

          {/* Title - NEVERBE Performance Style */}
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-primary mb-2">
            Athletes Trust Us
          </h2>
          <p className="text-sm text-muted font-medium max-w-md">
            Real performance reviews from real Sri Lankan athletes
          </p>
        </div>

        {/* Navigation Arrows - NEVERBE Style */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-12 h-12 rounded-full border-2 border-default bg-surface flex items-center justify-center text-primary hover:border-accent hover:bg-dark hover:text-accent transition-all duration-300 shadow-custom hover:shadow-hover"
            aria-label="Previous review"
          >
            <IoChevronBack size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-12 h-12 rounded-full border-2 border-default bg-surface flex items-center justify-center text-primary hover:border-accent hover:bg-dark hover:text-accent transition-all duration-300 shadow-custom hover:shadow-hover"
            aria-label="Next review"
          >
            <IoChevronForward size={20} />
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
        className="pb-4!"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard review={review} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Google Reviews CTA - Performance Style */}
      <div className="flex justify-center mt-12">
        <a
          href="https://g.page/r/neverbe/review"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-dark text-inverse rounded-full font-display font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-dark transition-all duration-300 shadow-custom hover:shadow-hover hover:-translate-y-1"
        >
          <FcGoogle size={20} />
          <span>Rate Your Performance</span>
          <div className="w-6 h-6 bg-accent text-dark rounded-full flex items-center justify-center group-hover:bg-dark group-hover:text-accent transition-colors">
            <IoChevronForward size={14} />
          </div>
        </a>
      </div>
    </section>
  );
};

export default CustomerReviews;
