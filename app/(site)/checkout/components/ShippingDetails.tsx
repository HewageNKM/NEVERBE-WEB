"use client";
import React from "react";
import { Customer } from "@/interfaces";

const ShippingDetails = ({
  shippingSameAsBilling,
  setShippingSameAsBilling,
  shippingCustomer,
  setShippingCustomer,
}: {
  shippingSameAsBilling: boolean;
  setShippingSameAsBilling: React.Dispatch<React.SetStateAction<boolean>>;
  shippingCustomer: Partial<Customer> | null;
  setShippingCustomer: React.Dispatch<
    React.SetStateAction<Partial<Customer> | null>
  >;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingCustomer((prev) => ({
      ...(prev as Customer),
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-black uppercase italic tracking-tighter text-primary">
          Shipping
        </h2>
      </div>

      <div className="flex items-center gap-3 mb-6 p-4 bg-surface-2 border border-default rounded-xl">
        <input
          type="checkbox"
          id="sameAddress"
          checked={shippingSameAsBilling}
          onChange={() => setShippingSameAsBilling((prev) => !prev)}
          className="h-5 w-5 border-default focus:ring-accent accent-accent rounded-sm"
        />
        <label
          htmlFor="sameAddress"
          className="text-sm font-bold uppercase tracking-wide text-secondary select-none cursor-pointer"
        >
          Same as billing address
        </label>
      </div>

      {!shippingSameAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 w-full animate-fadeIn">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
              Recipient Name *
            </label>
            <input
              type="text"
              name="shippingName"
              required
              value={shippingCustomer?.shippingName || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
              Phone *
            </label>
            <input
              type="tel"
              name="shippingPhone"
              required
              value={shippingCustomer?.shippingPhone || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
              Address *
            </label>
            <input
              type="text"
              name="shippingAddress"
              required
              value={shippingCustomer?.shippingAddress || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
              City *
            </label>
            <input
              type="text"
              name="shippingCity"
              required
              value={shippingCustomer?.shippingCity || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="shippingZip"
              value={shippingCustomer?.shippingZip || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ShippingDetails;
