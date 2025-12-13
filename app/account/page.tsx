"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/authSlice/authSlice";
import Image from "next/image";
import { Logo } from "@/assets/images";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut, updatePassword, updateProfile } from "@firebase/auth";

const Account = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);
  const { user } = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        try {
          // Fetch Orders
          const ordersQuery = query(
            collection(db, "orders"),
            where("userId", "==", user.uid)
          );
          const ordersSnapshot = await getDocs(ordersQuery);
          const ordersData = ordersSnapshot.docs.map((doc) => ({
            id: doc.id, // @ts-ignore
            ...doc.data(),
          }));
          setOrders(ordersData); // @ts-ignore

          // Fetch Addresses via API
          const token = await auth.currentUser?.getIdToken();
          const res = await fetch("/api/v1/user/addresses", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setAddresses(data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    fetchData();
  }, [user]);

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/account/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fName = formData.get("fName") as string;
    const lName = formData.get("lName") as string;
    const newPass = formData.get("newPass") as string;

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: `${fName} ${lName}`.trim(),
        });

        if (newPass) {
          await updatePassword(auth.currentUser, newPass);
        }
        toast.success("Profile updated successfully!");

        // Update Redux state manually to reflect changes immediately
        const updatedUser = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          phoneNumber: auth.currentUser.phoneNumber,
          providerId: auth.currentUser.providerId,
          emailVerified: auth.currentUser.emailVerified,
          isAnonymous: auth.currentUser.isAnonymous,
          memberSince: auth.currentUser.metadata.creationTime,
        };

        dispatch(setUser(updatedUser));
      }
    } catch (err: any) {
      toast.error("Error updating profile: " + err.message);
    }
  };

  const handleSaveAddress = async (
    e: React.FormEvent<HTMLFormElement>,
    type: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddress = {
      type,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      phone: formData.get("phone") as string,
      isDefault: false, // Default logic simplified for now
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
          // Refresh addresses
          // Ideally we update state locally to avoid refetch, but refetch is safer for encrypted data flow verification?
          // Actually, we need to show the decrypted data. The API returns it on GET.
          // Let's just refetch or update local state aggressively if needed.
          // For simplicity, I'll refetch.
          const fetchRes = await fetch("/api/v1/user/addresses", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (fetchRes.ok) {
            const data = await fetchRes.json();
            setAddresses(data);
          }
          toast.success(`${type} Address updated!`);
          setAddingAddress(false); // Used as toggle for editing view? I'll reuse or change state logic.
        }
      }
    } catch (error) {
      console.error("Error saving address", error);
    }
  };

  // --- Loading State ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-medium uppercase tracking-wider">
        Loading Account...
      </div>
    );
  if (!user) {
    // Ideally redirect or show login
    if (typeof window !== "undefined") window.location.href = "/account/login";
    return null;
  }

  // --- Sub-Components (Views) ---

  const DashboardView = () => (
    <div className="space-y-12">
      <div className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-medium uppercase tracking-tight mb-2">
          Member Profile
        </h2>
        <p className="text-gray-500">
          Member since{" "}
          {user.memberSince
            ? new Date(user.memberSince).toDateString()
            : "Recent"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 p-8 flex flex-col justify-between h-64">
          <h3 className="text-xl font-medium">Orders</h3>
          <p className="text-gray-600 mt-2">
            Track your recent purchases and view history.
          </p>
          <button
            onClick={() => setActiveTab("orders")}
            className="mt-auto self-start border-b border-black text-sm font-medium hover:text-gray-600 transition-colors"
          >
            View All ({orders.length})
          </button>
        </div>
        <div className="bg-gray-100 p-8 flex flex-col justify-between h-64">
          <h3 className="text-xl font-medium">Settings</h3>
          <p className="text-gray-600 mt-2">
            Manage your profile, login details, and preferences.
          </p>
          <button
            onClick={() => setActiveTab("details")}
            className="mt-auto self-start border-b border-black text-sm font-medium hover:text-gray-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-medium uppercase tracking-tight">
        Order History
      </h2>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order: any) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row border border-gray-200 p-6 gap-6 hover:border-black transition-colors"
            >
              <div className="w-24 h-24 bg-gray-100 shrink-0">
                {/* Assuming order.items is an array and we take the first item's image */}
                <img
                  src={
                    order.items?.[0]?.thumbnail ||
                    "https://placehold.co/400?text=No+Image"
                  }
                  alt="Product"
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg capitalize">
                    {order.status || "Processing"}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {order.createdAt
                      ? new Date(order.createdAt).toDateString()
                      : "Recent"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  Order #{order.orderId || order.id.slice(0, 8)}
                </p>
                <p className="font-medium mt-2">
                  LKR {order.total?.toLocaleString() || "0.00"}
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button className="px-6 py-2 border border-gray-300 text-sm hover:border-black transition-colors">
                  View Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const AddressCard = ({ type }: { type: string }) => {
    // @ts-ignore
    const existing = addresses.find((a) => a.type === type);
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
      return (
        <form
          onSubmit={(e) => {
            handleSaveAddress(e, type);
            setIsEditing(false);
          }}
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
            className="p-3 border w-full text-sm"
          />
          <input
            name="city"
            defaultValue={existing?.city || ""}
            placeholder="City"
            required
            className="p-3 border w-full text-sm"
          />
          <input
            name="phone"
            defaultValue={existing?.phone || ""}
            placeholder="Phone Number"
            required
            className="p-3 border w-full text-sm"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 text-sm font-bold uppercase w-full"
          >
            Save {type} Address
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

  const AddressesView = () => (
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

  const DetailsView = () => (
    <div className="max-w-xl">
      <h2 className="text-2xl font-medium uppercase tracking-tight mb-8">
        Account Details
      </h2>
      <form className="space-y-6" onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <input
              name="fName"
              type="text"
              defaultValue={user.name ? user.name.split(" ")[0] : ""}
              placeholder="First Name"
              className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <input
              name="lName"
              type="text"
              defaultValue={
                user.name && user.name.split(" ").length > 1
                  ? user.name.split(" ")[1]
                  : ""
              }
              placeholder="Last Name"
              className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500 transition-colors"
            />
          </div>
        </div>
        <div className="space-y-1">
          <input
            readOnly
            type="email"
            value={user.email}
            className="w-full p-3 border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed outline-none rounded-none"
          />
        </div>
        <div className="pt-8">
          <h3 className="text-lg font-medium mb-4 uppercase tracking-tight">
            Change Password
          </h3>
          <div className="space-y-4">
            <input
              name="newPass"
              type="password"
              placeholder="New Password"
              className="w-full p-3 border border-gray-300 focus:border-black focus:ring-0 outline-none rounded-none placeholder-gray-500"
            />
          </div>
        </div>
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 rounded-full transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-10 md:hidden flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Image
              src={Logo}
              width={100}
              height={100}
              alt="NEVERBE Logo"
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">
            My Account
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="md:sticky md:top-24">
              <div className="hidden md:block w-32 h-16 relative mb-8">
                <Image
                  src={Logo}
                  alt="NEVERBE Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <h1 className="hidden md:block text-3xl font-medium uppercase tracking-tighter mb-8">
                Settings
              </h1>
              <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-8 md:gap-4 pb-4 md:pb-0 border-b md:border-none border-gray-200">
                {[
                  { id: "dashboard", label: "Profile" },
                  { id: "orders", label: "Orders" },
                  { id: "addresses", label: "Addresses" },
                  { id: "details", label: "Account Details" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`text-left whitespace-nowrap text-lg transition-colors ${
                      activeTab === item.id
                        ? "font-medium text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-left text-lg text-gray-400 hover:text-gray-600 mt-4 hidden md:block"
                >
                  Log Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[60vh]">
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "orders" && <OrdersView />}
            {activeTab === "addresses" && <AddressesView />}
            {activeTab === "details" && <DetailsView />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
