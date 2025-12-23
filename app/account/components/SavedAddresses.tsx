"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { auth } from "@/firebase/firebaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMapOutline,
  IoCardOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoPencilOutline,
} from "react-icons/io5";

interface Address {
  type: "Shipping" | "Billing";
  address: string;
  city: string;
  phone: string;
}

interface SavedAddressesProps {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  user: any;
}

const SavedAddresses: React.FC<SavedAddressesProps> = ({
  addresses,
  setAddresses,
  user,
}) => {
  const AddressCard = ({ type }: { type: "Shipping" | "Billing" }) => {
    const existing = addresses.find((a) => a.type === type);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);
      const formData = new FormData(e.currentTarget);

      const newAddress = {
        type,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        phone: formData.get("phone") as string,
      };

      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/v1/customers/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAddress),
        });

        if (res.ok) {
          // Update local state
          const updated = addresses.filter((a) => a.type !== type);
          setAddresses([...updated, newAddress]);

          toast.success(`${type} Address Updated`, {
            style: { background: "#111", color: "#fff", borderRadius: "10px" },
          });
          setIsEditing(false);
        }
      } catch (err) {
        toast.error("Failed to save address");
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="h-full">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSave}
              className="bg-surface-2 p-8 rounded-[2rem] border border-white/10 space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-inverse uppercase tracking-tight">
                  Edit {type} Address
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-muted hover:text-white"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>

              <input
                name="address"
                defaultValue={existing?.address}
                placeholder="Street Address"
                required
                className="w-full bg-dark p-4 rounded-xl border border-white/5 focus:border-accent outline-none text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="city"
                  defaultValue={existing?.city}
                  placeholder="City"
                  required
                  className="w-full bg-dark p-4 rounded-xl border border-white/5 focus:border-accent outline-none text-sm"
                />
                <input
                  name="phone"
                  defaultValue={existing?.phone}
                  placeholder="Phone Number"
                  required
                  className="w-full bg-dark p-4 rounded-xl border border-white/5 focus:border-accent outline-none text-sm"
                />
              </div>

              <button
                disabled={isSaving}
                className="w-full bg-inverse text-dark py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all"
              >
                {isSaving ? "Saving..." : "Save Address"}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="display"
              className="bg-surface-2 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-full min-h-[240px] relative group"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center text-accent border border-white/5">
                    {type === "Shipping" ? (
                      <IoMapOutline size={20} />
                    ) : (
                      <IoCardOutline size={20} />
                    )}
                  </div>
                  <h3 className="font-display font-black text-xl uppercase italic tracking-tighter text-inverse">
                    {type} Address
                  </h3>
                </div>

                {existing ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-inverse">
                      {existing.address}
                    </p>
                    <p className="text-sm text-muted">{existing.city}</p>
                    <p className="text-xs font-bold text-accent mt-2 tracking-widest">
                      {existing.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted/40 italic">
                    No address provided
                  </p>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-white transition-all"
                >
                  <IoPencilOutline size={14} />
                  {existing ? "Change Address" : "Add Address"}
                </button>
              </div>

              {existing && (
                <div className="absolute top-8 right-8 text-accent/50">
                  <IoCheckmarkCircleOutline size={24} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      <div className="border-b border-white/5 pb-6">
        <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-inverse">
          Your Addresses
        </h2>
        <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">
          Manage your delivery and billing locations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressCard type="Shipping" />
        <AddressCard type="Billing" />
      </div>
    </div>
  );
};

export default SavedAddresses;
