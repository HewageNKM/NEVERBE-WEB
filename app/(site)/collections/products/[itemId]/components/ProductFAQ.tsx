"use client";
import React from "react";

const ProductFAQ = () => {
  return (
    <section className="bg-surface-2 py-20 mt-16">
      <div className="max-w-content mx-auto px-8 md:px-12">
        <h3 className="text-lg font-display font-black uppercase italic tracking-tighter text-primary mb-12">
          The NEVERBE Standard
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
          <div className="space-y-4">
            <h4 className="text-sm font-display font-black uppercase tracking-tight text-primary">
              Secure COD Island-wide
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              We offer Cash on Delivery across all 25 districts in Sri Lanka.
              Pay only when your gear arrives at your door.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-display font-black uppercase tracking-tight text-primary">
              Premium 7A Craftsmanship
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Our footwear is built using the Master Copy (7A Grade) standard,
              delivering the perfect balance of iconic design and comfort.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-display font-black uppercase tracking-tight text-primary">
              7-Day Size Exchange
            </h4>
            <p className="text-sm text-muted leading-relaxed">
              Not the perfect fit? We accept size exchanges within 7 days of
              delivery to ensure you're performing at your best.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductFAQ;
