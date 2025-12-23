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
    <section className="flex flex-col items-start w-full">
      <h2 className="text-xl font-display font-black uppercase italic tracking-tighter mb-6 text-primary">
        Billing Address
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 w-full">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="first_name"
            required
            defaultValue={customer?.name.split(" ")[0] || ""}
            className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="last_name"
            required
            defaultValue={customer?.name.split(" ").slice(1).join(" ") || ""}
            className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            placeholder="Doe"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            required
            defaultValue={customer?.address || ""}
            className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            placeholder="House No, Street Name"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            required
            defaultValue={customer?.city || ""}
            className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            placeholder="Colombo"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="zip"
            defaultValue={customer?.zip || ""}
            className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            placeholder="00700"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            defaultValue={customer?.email || ""}
            className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            pattern="^07\d{8}$"
            required
            defaultValue={customer?.phone || ""}
            className="w-full h-12 px-4 bg-surface-2 border border-default rounded-xl focus:border-accent focus:bg-surface outline-none transition-all placeholder:text-muted text-sm font-bold text-primary"
            placeholder="07XXXXXXXX"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value="Sri Lanka"
            disabled
            className="w-full h-12 px-4 bg-surface-3 border border-default rounded-xl text-muted cursor-not-allowed text-sm font-bold"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <input
          type="checkbox"
          id="saveAddress"
          checked={saveAddress}
          onChange={() => setSaveAddress(!saveAddress)}
          className="h-5 w-5 border-default focus:ring-accent accent-accent rounded-sm"
        />
        <label
          htmlFor="saveAddress"
          className="text-sm font-bold text-secondary select-none cursor-pointer"
        >
          Save this information for next time
        </label>
      </div>
    </section>
  );
};

export default BillingDetails;
