"use client";
import React from "react";

const AboutUsClient = () => {
  return (
    <main className="w-full bg-white text-black min-h-screen pt-8 md:pt-12">
      {/* 1. HERO MANIFESTO */}
      <section className="w-full px-4 md:px-8 mb-20">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
            We Are <br /> Neverbe.
          </h1>
          <p className="text-lg md:text-2xl font-bold uppercase tracking-wide max-w-2xl text-gray-400">
            Redefining sneaker culture in Sri Lanka. Premium quality. Unbeatable
            prices. No compromises.
          </p>
        </div>
      </section>

      {/* 2. THE STORY (Split Layout) */}
      <section className="w-full border-t border-black px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Headline */}
          <div className="sticky top-24 h-fit">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
              The Mission
            </h2>
            <div className="h-2 w-20 bg-black"></div>
          </div>

          {/* Right: Content */}
          <div className="space-y-12 text-sm md:text-base leading-relaxed font-medium text-gray-600">
            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wide text-lg">
                Who We Are
              </h3>
              <p>
                At NEVERBE, we don't just sell shoes; we curate a lifestyle. We
                recognized a gap in the Sri Lankan market for high-quality,
                trend-setting footwear that doesn't cost a fortune. We bridge
                the gap between high-end streetwear and affordability, offering
                premium Master Copy (7A) sneakers that rival the originals in
                look, feel, and durability.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-black font-bold uppercase tracking-wide text-lg">
                Our Vision
              </h3>
              <p>
                Our vision is to become the undisputed leader in the alternative
                footwear market in Sri Lanka. We operate with transparency,
                focusing on ethical customer service and product quality. We
                believe style is a right, not a luxury reserved for the few.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY US (Grid System) */}
      <section className="w-full bg-surface-2 px-4 md:px-8 py-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[
              {
                title: "Premium Quality",
                desc: "We stock only Master Copy / 7A Grade products. Heavy materials, correct stitching, and durable soles.",
              },
              {
                title: "Island-wide Delivery",
                desc: "From Colombo to Jaffna, we deliver to your doorstep safely and securely within 3-5 working days.",
              },
              {
                title: "Cash on Delivery",
                desc: "Shop with total confidence. Inspect your package upon arrival and pay only when you are satisfied.",
              },
              {
                title: "Dedicated Support",
                desc: "Our team is here to help with sizing, styling, and order tracking via WhatsApp and Email.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3">
                <span className="text-xs font-black text-gray-300">
                  0{i + 1}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS STRIP (Optional) */}
      <section className="w-full px-4 md:px-8 py-16 border-t border-gray-200">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-xs font-bold uppercase text-gray-400 mb-1">
              Established
            </p>
            <p className="text-4xl font-black">2023</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400 mb-1">
              Customers
            </p>
            <p className="text-4xl font-black">5,000+</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400 mb-1">
              Products
            </p>
            <p className="text-4xl font-black">300+</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-gray-400 mb-1">
              Location
            </p>
            <p className="text-4xl font-black">Gampaha, LK</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUsClient;
