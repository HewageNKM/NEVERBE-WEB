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
        <h2 className="text-xl font-black uppercase tracking-tight">
          Shipping
        </h2>
      </div>

      <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 border border-gray-100">
        <input
          type="checkbox"
          id="sameAddress"
          checked={shippingSameAsBilling}
          onChange={() => setShippingSameAsBilling((prev) => !prev)}
          className="h-4 w-4 text-black border-gray-300 focus:ring-black accent-black rounded-sm"
        />
        <label
          htmlFor="sameAddress"
          className="text-sm font-bold uppercase tracking-wide text-gray-700 select-none cursor-pointer"
        >
          Same as billing address
        </label>
      </div>

      {!shippingSameAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 w-full animate-fadeIn">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Recipient Name *
            </label>
            <input
              type="text"
              name="shippingName"
              required
              value={shippingCustomer?.shippingName || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="shippingPhone"
              required
              value={shippingCustomer?.shippingPhone || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Address *
            </label>
            <input
              type="text"
              name="shippingAddress"
              required
              value={shippingCustomer?.shippingAddress || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              City *
            </label>
            <input
              type="text"
              name="shippingCity"
              required
              value={shippingCustomer?.shippingCity || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="shippingZip"
              value={shippingCustomer?.shippingZip || ""}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ShippingDetails;
