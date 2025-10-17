"use client";
import React from "react";
import { Customer } from "@/interfaces";

const BillingDetails = ({
  saveAddress,
  setSaveAddress,
  customer,
}: {
  saveAddress: boolean;
  setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>;
  customer: Customer | null;
}) => {
  return (
    <section className="flex flex-col items-start px-6 py-10 bg-white">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-wide text-gray-900">
        Billing Details
      </h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">
            <span className="text-red-500">*</span>First Name
          </span>
          <input
            type="text"
            name="first_name"
            defaultValue={customer?.name.split(" ")[0] || ""}
            placeholder="John"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">
            <span className="text-red-500">*</span>Last Name
          </span>
          <input
            type="text"
            name="last_name"
            defaultValue={customer?.name.split(" ").slice(1).join(" ") || ""}
            placeholder="Doe"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-lg font-medium">
            <span className="text-red-500">*</span>Address
          </span>
          <input
            type="text"
            name="address"
            defaultValue={customer?.address || ""}
            placeholder="123 Main Street"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">
            <span className="text-red-500">*</span>City
          </span>
          <input
            type="text"
            name="city"
            defaultValue={customer?.city || ""}
            placeholder="Colombo"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">Postal Code</span>
          <input
            type="text"
            name="zip"
            defaultValue={customer?.zip || ""}
            placeholder="00700"
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">
            <span className="text-red-500">*</span>Email
          </span>
          <input
            type="email"
            name="email"
            defaultValue={customer?.email || ""}
            placeholder="johndoe@example.com"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">
            <span className="text-red-500">*</span>Phone
          </span>
          <input
            type="tel"
            name="phone"
            defaultValue={customer?.phone || ""}
            placeholder="0712345678"
            required
            pattern="^07\d{8}$"
            title="Enter a valid phone number starting with 07XXXXXXXX"
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

      <div className="flex items-center gap-3 mt-6">
        <input
          type="checkbox"
          checked={saveAddress}
          onChange={() => setSaveAddress(!saveAddress)}
          className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary/50 rounded transition"
        />
        <span className="text-lg text-gray-700">Save this billing address</span>
      </div>
    </section>
  );
};

export default BillingDetails;