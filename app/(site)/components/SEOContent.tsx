"use client";
import React from "react";
import Link from "next/link";

const SEOContent = () => {
  return (
    <section className="w-full bg-white border-t border-gray-100 py-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-gray-400 text-xs leading-relaxed text-justify md:text-left">
          {/* LEFT COLUMN: Main Keywords */}
          <article className="space-y-4">
            <h2 className="text-black font-bold uppercase tracking-wide text-sm mb-2">
              Premium Footwear in Sri Lanka
            </h2>
            <p>
              NEVERBE is the premier online destination to{" "}
              <strong className="text-gray-600">buy shoes in Sri Lanka</strong>.
              We bridge the gap between high-end street culture and
              affordability, offering a curated selection of
              <strong className="text-gray-600">
                {" "}
                sneakers, running shoes, and casual footwear
              </strong>
              . Whether you are in Colombo, Kandy, or Galle, our island-wide
              delivery ensures you get the latest drops right to your door.
            </p>
            <p>
              We specialize in <strong>Master Copy (7A Quality)</strong>{" "}
              footwear, giving you the look and feel of major global brands like
              Nike, Adidas, and Jordan at a fraction of the cost. Experience
              premium materials, durable stitching, and iconic designs without
              the premium price tag.
            </p>
          </article>

          {/* RIGHT COLUMN: Categories & Trust */}
          <article className="space-y-4">
            <h3 className="text-black font-bold uppercase tracking-wide text-sm mb-2">
              Shop by Category
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                "Men's Sneakers",
                "Women's Running Shoes",
                "Sports Shoes",
                "Casual Slides",
                "High-Ankle Boots",
                "Gym Footwear",
                "Office Shoes",
                "Party Wear",
              ].map((tag, i) => (
                <span
                  key={i}
                  className="hover:text-black transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-black font-bold uppercase tracking-wide text-sm mb-2">
                Why Buy Online with NEVERBE?
              </h3>
              <p>
                Stop searching for "shoe shops near me" and trust our secure
                online platform. We offer{" "}
                <strong className="text-gray-600">
                  Cash on Delivery (COD)
                </strong>
                , hassle-free exchanges, and dedicated customer support. Join
                thousands of satisfied customers who have upgraded their shoe
                game with NEVERBE.
              </p>
            </div>
          </article>
        </div>

        {/* SEO Navigation Links (The "Tag Cloud") */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase text-gray-300 mb-4 tracking-widest">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] font-medium text-gray-500 uppercase tracking-wide">
            <Link
              href="/collections/products?category=Running%20Shoes"
              className="hover:text-black hover:underline transition-colors"
            >
              Running Shoes Sri Lanka
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="/collections/products?category=Sandals%20%26%20Slippers%20%26%20Slides"
              className="hover:text-black hover:underline transition-colors"
            >
              Men's Sandals
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="/collections/products?brand=Nike"
              className="hover:text-black hover:underline transition-colors"
            >
              Nike Copy Shoes
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="/collections/offers"
              className="hover:text-black hover:underline transition-colors"
            >
              Shoe Sale
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="/collections/products?category=Sneakers"
              className="hover:text-black hover:underline transition-colors"
            >
              Best Sneakers 2025
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContent;
