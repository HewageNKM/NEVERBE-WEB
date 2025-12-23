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
} from "react-icons/io5";

interface SavedAddressesProps {
  addresses: any[];
  setAddresses: React.Dispatch<React.SetStateAction<any[]>>;
  user: any;
}

const SavedAddresses: React.FC<SavedAddressesProps> = ({
  addresses,
  setAddresses,
  user,
}) => {
  const AddressCard = ({ type }: { type: "Shipping" | "Billing" }) => {
    // @ts-ignore
    const existing = addresses.find((a) => a.type === type);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSaving(true);
      const formData = new FormData(e.currentTarget);
      const newAddress = {
        type,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        phone: formData.get("phone") as string,
        isDefault: false,
      };

      try {
        if (user?.uid) {
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
            const fetchRes = await fetch("/api/v1/customers/addresses", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (fetchRes.ok) {
              const data = await fetchRes.json();
              setAddresses(data);
            }
            toast.success(`${type.toUpperCase()} PROTOCOL UPDATED`, {
              style: {
                background: "#1a1a1a",
                color: "#97e13e",
                fontWeight: "bold",
              },
            });
            setIsEditing(false);
          }
        }
      } catch (error) {
        console.error("Error saving address", error);
        toast.error("PROTOCOL SYNC FAILED");
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
              onSubmit={handleSaveAddress}
              className="bg-surface-2 p-8 rounded-3xl border border-accent/20 shadow-hover space-y-5 h-full flex flex-col"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-display font-black text-xl uppercase italic tracking-tighter text-accent">
                  Configure {type}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-dark rounded-full text-muted hover:text-error transition-colors"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <input
                  name="address"
                  defaultValue={existing?.address || ""}
                  placeholder="Street Address"
                  required
                  className="w-full bg-surface-3 p-4 text-sm font-bold border border-white/5 focus:border-accent outline-none rounded-xl transition-all placeholder:text-muted/50"
                />
                <input
                  name="city"
                  defaultValue={existing?.city || ""}
                  placeholder="City / Region"
                  required
                  className="w-full bg-surface-3 p-4 text-sm font-bold border border-white/5 focus:border-accent outline-none rounded-xl transition-all placeholder:text-muted/50"
                />
                <input
                  name="phone"
                  defaultValue={existing?.phone || ""}
                  placeholder="Contact Number"
                  required
                  className="w-full bg-surface-3 p-4 text-sm font-bold border border-white/5 focus:border-accent outline-none rounded-xl transition-all placeholder:text-muted/50"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-accent text-dark py-4 text-xs font-black uppercase italic tracking-widest rounded-full shadow-custom hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? "Syncing..." : `Initialize ${type} Blueprint`}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface-2 p-8 rounded-[2.5rem] border border-white/5 hover:border-accent/30 transition-all duration-500 group flex flex-col justify-between h-full min-h-[260px] relative overflow-hidden"
            >
              {/* Decorative Background Icon */}
              <div className="absolute top-0 right-0 p-8 text-accent/5 -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110 group-hover:text-accent/10">
                {type === "Shipping" ? (
                  <IoMapOutline size={180} />
                ) : (
                  <IoCardOutline size={180} />
                )}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center text-accent shadow-custom border border-accent/20">
                    {type === "Shipping" ? (
                      <IoMapOutline size={20} />
                    ) : (
                      <IoCardOutline size={20} />
                    )}
                  </div>
                  <h3 className="font-display font-black text-xl uppercase italic tracking-tighter text-inverse">
                    {type === "Shipping"
                      ? "Deployment Blueprint"
                      : "Fiscal Protocol"}
                  </h3>
                </div>

                {existing ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-tight text-inverse">
                      {existing.address}
                    </p>
                    <p className="text-sm font-medium text-muted">
                      {existing.city}
                    </p>
                    <p className="text-xs font-black text-accent mt-2 italic tracking-widest">
                      {existing.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs font-bold uppercase tracking-widest text-muted/40 italic">
                    Protocol Not Initialized
                  </p>
                )}
              </div>

              <div className="mt-8 relative z-10">
                {user?.isAnonymous ? (
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted/50 italic">
                    <div className="w-1 h-1 bg-muted/50 rounded-full" />
                    Authentication Required
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-black uppercase italic tracking-widest text-accent underline underline-offset-8 hover:text-inverse transition-all"
                  >
                    {existing
                      ? "Re-configure Blueprint"
                      : "Initialize Protocol"}
                  </button>
                )}
              </div>

              {existing && (
                <div className="absolute top-8 right-8 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
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
    <div className="space-y-10 animate-fade">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent italic">
          Database Management
        </span>
        <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter text-inverse">
          Blueprint Database
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AddressCard type="Shipping" />
        <AddressCard type="Billing" />
      </div>
    </div>
  );
};

export default SavedAddresses;
