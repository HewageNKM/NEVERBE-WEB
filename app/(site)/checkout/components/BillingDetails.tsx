"use client";
import React from "react";
import { Customer } from "@/interfaces";

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
    <section className="flex max-w-2xl flex-col items-start px-3 md:px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing Details</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Please enter your billing information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            * First Name
          </label>
          <input
            type="text"
            name="first_name"
            required
            defaultValue={customer?.name.split(" ")[0] || ""}
            placeholder="John"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            * Last Name
          </label>
          <input
            type="text"
            name="last_name"
            required
            defaultValue={customer?.name.split(" ").slice(1).join(" ") || ""}
            placeholder="Doe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">
            * Address
          </label>
          <input
            type="text"
            name="address"
            required
            defaultValue={customer?.address || ""}
            placeholder="123 Main Street"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">* City</label>
          <input
            type="text"
            name="city"
            required
            defaultValue={customer?.city || ""}
            placeholder="Colombo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Postal Code
          </label>
          <input
            type="text"
            name="zip"
            defaultValue={customer?.zip || ""}
            placeholder="00700"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">* Email</label>
          <input
            type="email"
            name="email"
            required
            defaultValue={customer?.email || ""}
            placeholder="johndoe@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">* Phone</label>
          <input
            type="tel"
            name="phone"
            pattern="^07\d{8}$"
            title="Enter a valid phone number starting with 07XXXXXXXX"
            required
            defaultValue={customer?.phone || ""}
            placeholder="0712345678"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value="Sri Lanka"
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <input
          type="checkbox"
          checked={saveAddress}
          onChange={() => setSaveAddress(!saveAddress)}
          className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary/50 rounded transition"
        />
        <span className="text-gray-700 text-base">
          Save this billing address
        </span>
      </div>
    </section>
  );
};

export default BillingDetails;
