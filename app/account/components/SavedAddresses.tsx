import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "@/firebase/firebaseClient";

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
  const AddressCard = ({ type }: { type: string }) => {
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
          const res = await fetch("/api/v1/user/addresses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newAddress),
          });

          if (res.ok) {
            const fetchRes = await fetch("/api/v1/user/addresses", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (fetchRes.ok) {
              const data = await fetchRes.json();
              setAddresses(data);
            }
            toast.success(`${type} Address updated!`);
            setIsEditing(false);
          }
        }
      } catch (error) {
        console.error("Error saving address", error);
        toast.error("Failed to save address");
      } finally {
        setIsSaving(false);
      }
    };

    if (isEditing) {
      return (
        <form
          onSubmit={handleSaveAddress}
          className="bg-gray-50 p-6 border border-gray-200 space-y-4 h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">{type} Address</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm underline"
            >
              Cancel
            </button>
          </div>

          <input
            name="address"
            defaultValue={existing?.address || ""}
            placeholder="Address"
            required
            className="p-3 border w-full text-sm outline-none focus:border-black"
          />
          <input
            name="city"
            defaultValue={existing?.city || ""}
            placeholder="City"
            required
            className="p-3 border w-full text-sm outline-none focus:border-black"
          />
          <input
            name="phone"
            defaultValue={existing?.phone || ""}
            placeholder="Phone Number"
            required
            className="p-3 border w-full text-sm outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="bg-black text-white px-6 py-2 text-sm font-bold uppercase w-full disabled:opacity-50"
          >
            {isSaving ? "Saving..." : `Save ${type} Address`}
          </button>
        </form>
      );
    }

    return (
      <div className="border border-gray-200 p-6 flex flex-col justify-between h-full min-h-[200px]">
        <div>
          <h3 className="font-medium text-lg mb-4">{type} Address</h3>
          {existing ? (
            <p className="text-gray-600 leading-relaxed">
              {existing.address}
              <br />
              {existing.city}
              <br />
              {existing.phone}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              No {type.toLowerCase()} address set.
            </p>
          )}
        </div>
        <div className="mt-6">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium underline underline-offset-4 hover:text-gray-600"
          >
            {existing ? "Edit" : "Add"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-medium uppercase tracking-tight">
        Saved Addresses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressCard type="Shipping" />
        <AddressCard type="Billing" />
      </div>
    </div>
  );
};

export default SavedAddresses;
