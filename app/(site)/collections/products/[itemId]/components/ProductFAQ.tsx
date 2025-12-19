"use client";
import React from "react";

const ProductFAQ = () => {
  return (
    <section className="bg-[#f5f5f5] py-20 mt-16">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12">
        <h3 className="text-[20px] font-medium text-[#111] mb-12 tracking-tight">
          The NEVERBE Standard
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          <div className="space-y-4">
            <h4 className="text-[16px] font-medium text-[#111]">
              Secure COD Island-wide
            </h4>
            <p className="text-[14px] text-[#707072] leading-relaxed">
              We offer Cash on Delivery across all 25 districts in Sri Lanka.
              Pay only when your gear arrives at your door.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[16px] font-medium text-[#111]">
              Premium 7A Craftsmanship
            </h4>
            <p className="text-[14px] text-[#707072] leading-relaxed">
              Our footwear is built using the Master Copy (7A Grade) standard,
              delivering the perfect balance of iconic design and comfort.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[16px] font-medium text-[#111]">
              7-Day Size Exchange
            </h4>
            <p className="text-[14px] text-[#707072] leading-relaxed">
              Not the perfect fit? We accept size exchanges within 7 days of
              delivery to ensure you’re performing at your best.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
