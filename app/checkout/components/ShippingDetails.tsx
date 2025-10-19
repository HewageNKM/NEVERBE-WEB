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
      ...(prev as Customer),
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm px-6 py-8 mt-6 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Shipping Details
      </h2>
      <p className="text-gray-500 mb-4 text-sm">
        Enter your delivery address details.
      </p>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={shippingSameAsBilling}
          onChange={() => setShippingSameAsBilling((prev) => !prev)}
          className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary/50 rounded transition"
        />
        <span className="text-gray-700 text-base">
          Same as billing address
        </span>
      </div>

      {!shippingSameAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">
              * Shipping Name
            </label>
            <input
              type="text"
              name="shippingName"
              required
              value={shippingCustomer?.shippingName || ""}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              * Shipping Phone
            </label>
            <input
              type="tel"
              name="shippingPhone"
              pattern="^07\d{8}$"
              title="Enter a valid phone number starting with 07XXXXXXXX"
              required
              value={shippingCustomer?.shippingPhone || ""}
              onChange={handleChange}
              placeholder="0712345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">
              * Shipping Address
            </label>
            <input
              type="text"
              name="shippingAddress"
              required
              value={shippingCustomer?.shippingAddress || ""}
              onChange={handleChange}
              placeholder="123 Main Street"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">* City</label>
            <input
              type="text"
              name="shippingCity"
              required
              value={shippingCustomer?.shippingCity || ""}
              onChange={handleChange}
              placeholder="Kandy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Postal Code</label>
            <input
              type="text"
              name="shippingZip"
              value={shippingCustomer?.shippingZip || ""}
              onChange={handleChange}
              placeholder="20000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Country</label>
            <input
              type="text"
              name="shippingCountry"
              value="Sri Lanka"
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ShippingDetails;
