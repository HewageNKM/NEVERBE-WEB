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
  setShippingCustomer: React.Dispatch<React.SetStateAction<Partial<Customer> | null>>;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingCustomer((prev) => ({
      ...(prev as Customer), // Cast prev to avoid type errors
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="flex flex-col items-start px-6 py-10 bg-white mt-6">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-wide text-gray-900">
        Shipping Details
      </h1>

      <div className="flex items-center gap-3 mt-4">
        <input
          type="checkbox"
          checked={shippingSameAsBilling}
          onChange={() => setShippingSameAsBilling((prev) => !prev)}
          className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary/50 rounded transition"
        />
        <span className="text-lg text-gray-700">Same as billing address</span>
      </div>

      {!shippingSameAsBilling && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <label className="flex flex-col gap-1">
            <span className="text-lg font-medium">
              <span className="text-red-500">*</span>Shipping Name
            </span>
            <input
              type="text"
              name="shippingName"
              value={shippingCustomer?.shippingName || ""}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-lg font-medium">
              <span className="text-red-500">*</span>Shipping Phone
            </span>
            <input
              type="tel"
              pattern="^07\d{8}$"
              name="shippingPhone"
              value={shippingCustomer?.shippingPhone || ""}
              onChange={handleChange}
              placeholder="0712345678"
              required
              title="Enter a valid phone number starting with 07XXXXXXXX"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-lg font-medium">
              <span className="text-red-500">*</span>Shipping Address
            </span>
            <input
              type="text"
              name="shippingAddress" 
              value={shippingCustomer?.shippingAddress || ""} 
              onChange={handleChange}
              placeholder="123 Main Street"
              required
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-lg font-medium">
              <span className="text-red-500">*</span>Shipping City
            </span>
            <input
              type="text"
              name="shippingCity"
              value={shippingCustomer?.shippingCity || ""}
              onChange={handleChange}
              placeholder="Kandy"
              required
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-lg font-medium">Postal Code</span>
            <input
              type="text"
              name="shippingZip"
              value={shippingCustomer?.shippingZip || ""}
              onChange={handleChange}
              placeholder="20000"
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-lg font-medium">Country</span>
            <input
              type="text"
              value="Sri Lanka"
              disabled
              className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100"
            />
          </label>
        </div>
      )}
    </section>
  );
};

export default ShippingDetails;