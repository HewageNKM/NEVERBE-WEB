"use client";
import React from "react";
import {
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
} from "react-icons/hi";
import { BiSupport } from "react-icons/bi";

const WhyUs = () => {
  const benefits = [
    {
      title: "Island-wide Delivery",
      desc: "Fast delivery to your doorstep.",
      icon: HiOutlineTruck,
    },
    {
      title: "Cash on Delivery",
      desc: "Pay when you receive.",
      icon: HiOutlineShieldCheck,
    },
    {
      title: "Easy Returns",
      desc: "Hassle-free exchange policy.",
      icon: HiOutlineRefresh,
    },
    {
      title: "Premium Support",
      desc: "Call us anytime: 070 520 8999",
      icon: BiSupport,
    },
  ];

  return (
    <section className="w-full border-t border-default bg-surface py-12 md:py-16">
      <div className="max-w-content mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {benefits.map((item, index) => (
            <div key={index} className="flex flex-col items-start gap-3 group">
              <div className="p-3 rounded-full bg-surface-2 text-primary group-hover:bg-accent group-hover:text-dark transition-all duration-300 shadow-sm group-hover:shadow-custom">
                <item.icon size={24} />
              </div>
              <div>
                <h3 className="font-display font-black uppercase text-sm tracking-tight mb-1 text-primary group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
