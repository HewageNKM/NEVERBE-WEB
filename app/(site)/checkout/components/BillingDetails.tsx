"use client";
import React from "react";
import { Customer } from "@/interfaces/BagItem";

interface BillingDetailsProps {
  saveAddress: boolean;
  setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>;
  customer: Customer | null;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({
  saveAddress,
  setSaveAddress,
  customer,
}) => {
  return (
    <section className="flex flex-col items-start w-full">
      <h2 className="text-xl font-black uppercase tracking-tight mb-6">
        Billing Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 w-full">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            First Name *
          </label>
          <input
            type="text"
            name="first_name"
            required
            defaultValue={customer?.name.split(" ")[0] || ""}
            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            name="last_name"
            required
            defaultValue={customer?.name.split(" ").slice(1).join(" ") || ""}
            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            placeholder="Doe"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Address *
          </label>
          <input
            type="text"
            name="address"
            required
            defaultValue={customer?.address || ""}
            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            placeholder="House No, Street Name"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            defaultValue={customer?.city || ""}
            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            placeholder="Colombo"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            name="zip"
            defaultValue={customer?.zip || ""}
            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            placeholder="00700"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            defaultValue={customer?.email || ""}
            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            pattern="^07\d{8}$"
            required
            defaultValue={customer?.phone || ""}
            className="w-full h-12 px-4 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            placeholder="07XXXXXXXX"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value="Sri Lanka"
            disabled
            className="w-full h-12 px-4 bg-gray-100 border border-transparent text-gray-500 cursor-not-allowed text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <input
          type="checkbox"
          id="saveAddress"
          checked={saveAddress}
          onChange={() => setSaveAddress(!saveAddress)}
          className="h-4 w-4 text-black border-gray-300 focus:ring-black accent-black rounded-sm"
        />
        <label
          htmlFor="saveAddress"
          className="text-sm font-medium text-gray-700 select-none cursor-pointer"
        >
          Save this information for next time
        </label>
      </div>
    </section>
  );
};

export default BillingDetails;
