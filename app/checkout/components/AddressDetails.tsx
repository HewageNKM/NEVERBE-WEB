"use client";
import React from "react";
import { Customer } from "@/interfaces";

const AddressDetails = ({
  saveAddress,
  setSaveAddress,
  customer,
}: {
  saveAddress: boolean;
  setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>;
  customer: Customer;
}) => {
  return (
    <section className="flex flex-col items-start px-6 py-10 bg-white">
      <h1 className="text-3xl lg:text-4xl font-bold tracking-wide text-gray-900">
        Address Details
      </h1>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* First & Last Name */}
        <label className="flex flex-col gap-1">
          <span className="text-lg md:text-xl font-medium">*First Name</span>
          <input
            type="text"
            name="first_name"
            defaultValue={customer?.name.split(" ")[0]}
            placeholder="Sandun"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-lg md:text-xl font-medium">*Last Name</span>
          <input
            type="text"
            name="last_name"
            defaultValue={customer?.name.split(" ")[1]}
            placeholder="Dilhan"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
          />
        </label>

        {/* Email */}
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-lg md:text-xl font-medium">*Email</span>
          <input
            type="email"
            name="email"
            defaultValue={customer?.email}
            placeholder="example@gmail.com"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
          />
        </label>

        {/* Mobile */}
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-lg md:text-xl font-medium">*Mobile</span>
          <input
            type="text"
            name="phone"
            defaultValue={customer?.phone}
            placeholder="0777668765"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
          />
        </label>

        {/* Address */}
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-lg md:text-xl font-medium">*Address</span>
          <input
            type="text"
            name="address"
            defaultValue={customer?.address}
            placeholder="98/1A, Ingiriya"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
          />
        </label>

        {/* City & Postal Code */}
        <label className="flex flex-col gap-1">
          <span className="text-lg md:text-xl font-medium">*City</span>
          <input
            type="text"
            name="city"
            defaultValue={customer?.city}
            placeholder="Dompe"
            required
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-lg md:text-xl font-medium">Postal Code</span>
          <input
            type="text"
            name="zip"
            defaultValue={customer?.zip}
            placeholder="11700"
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition"
          />
        </label>

        {/* Country */}
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-lg md:text-xl font-medium">*Country</span>
          <input
            type="text"
            name="country"
            value="Sri Lanka"
            disabled
            className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
          />
        </label>
      </div>

      {/* Save Address */}
      <div className="flex items-center gap-3 mt-6">
        <input
          type="checkbox"
          name="saveAddress"
          defaultChecked={saveAddress}
          onChange={() => setSaveAddress((prev) => !prev)}
          className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary/50 rounded transition"
        />
        <span className="text-lg text-gray-700">
          Save this address for future purchases
        </span>
      </div>
    </section>
  );
};

export default AddressDetails;
