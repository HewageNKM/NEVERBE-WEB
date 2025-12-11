"use client";
import React from "react";

const AboutUsClient = () => {
  return (
    <section className="lg:pt-32 pt-12 md:pt-16 w-full">
      {/* Hero Section */}
      <div className="relative w-full bg-linear-to-r from-primary-100 to-indigo-600 text-white py-24 px-6 md:px-20 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="md:text-5xl text-4xl font-display font-bold mb-2 drop-shadow-lg">
            About NEVERBE
          </h1>
          <p className="text-lg md:text-xl drop-shadow-sm">
            Your trusted destination for premium copy shoes in Sri Lanka,
            redefining style and affordability.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Who We Are */}
          <section className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At NEVERBE, we take pride in offering high-quality replicas of
              globally renowned shoe brands. Our commitment is to bring
              unparalleled style and comfort to every customer while maintaining
              affordable prices. Whether you&apos;re looking for everyday
              essentials or statement footwear, we&apos;ve got you covered.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-4">
              Our Mission & Vision
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Our mission is simple: to provide top-notch replica shoes that
                blend durability, design, and value. We believe that style
                should be accessible to all, regardless of budget.
              </p>
              <p>
                Our vision is to lead the replica shoe market in Sri Lanka with
                a focus on ethical practices, outstanding customer service, and
                unwavering quality.
              </p>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-8 text-center">
              Why Choose NEVERBE?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Affordable Luxury",
                  desc: "Experience premium designs without breaking the bank.",
                },
                {
                  title: "Extensive Collection",
                  desc: "A diverse range of styles to suit every occasion.",
                },
                {
                  title: "Reliable Shipping",
                  desc: "Fast, secure delivery across Sri Lanka.",
                },
                {
                  title: "Exceptional Support",
                  desc: "Dedicated customer service for all your queries.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default AboutUsClient;
