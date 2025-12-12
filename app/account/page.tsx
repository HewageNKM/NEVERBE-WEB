"use client";
import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";

const Account = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. Set Basic User Info
        setUser({
          name: currentUser.displayName || "Member",
          email: currentUser.email,
          uid: currentUser.uid,
          memberSince: currentUser.metadata.creationTime
            ? new Date(currentUser.metadata.creationTime).getFullYear()
            : "2024",
        });

        // 2. Fetch Orders & Addresses from Firestore
        // Assumes structure: users/{uid}/orders AND users/{uid}/addresses
        try {
          const ordersRef = collection(db, "users", currentUser.uid, "orders");
          const addrRef = collection(db, "users", currentUser.uid, "addresses");

          const [ordersSnap, addrSnap] = await Promise.all([
            getDocs(ordersRef),
            getDocs(addrRef),
          ]);

          setOrders(
            ordersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
          setAddresses(
            addrSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        // Redirect to login if needed, or just clear state
        setUser(null);
        window.location.href = "/login";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const fName = e.target.fName.value;
    const lName = e.target.lName.value;
    const newPass = e.target.newPass.value;

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: `${fName} ${lName}`.trim(),
        });

        if (newPass) {
          await updatePassword(auth.currentUser, newPass);
        }
        alert("Profile updated successfully!");

        // Update local state to reflect name change immediately
        setUser((prev) => ({ ...prev, name: `${fName} ${lName}`.trim() }));
      }
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  // --- Loading State ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-medium uppercase tracking-wider">
        Loading Account...
      </div>
    );
  if (!user) return null; // Or return a login prompt

  // --- Sub-Components (Views) ---

  const DashboardView = () => (
    <div className="space-y-12">
      <div className="border-b border-gray-200 pb-8">
        <h2 className="text-2xl font-medium uppercase tracking-tight mb-2">
          Member Profile
        </h2>
        <p className="text-gray-500">Member since {user.memberSince}</p>
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
          orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row border border-gray-200 p-6 gap-6 hover:border-black transition-colors"
            >
              <div className="w-24 h-24 bg-gray-100 shrink-0">
                <img
                  src={order.img || "https://placehold.co/400?text=No+Image"}
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
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toDateString()
                      : "Recent"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="font-medium mt-2">{order.total || "LKR 0.00"}</p>
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

  const AddressesView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-medium uppercase tracking-tight">
          Saved Addresses
        </h2>
        <button className="text-sm border-b border-black pb-0.5 hover:text-gray-600">
          Add New
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses saved.</p>
        ) : (
          addresses.map((addr, idx) => (
            <div
              key={idx}
              className="border border-gray-200 p-6 flex flex-col justify-between h-full min-h-[200px]"
            >
              <div>
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium text-lg">{addr.type}</h3>
                  {addr.default && (
                    <span className="text-xs bg-black text-white px-2 py-1">
                      DEFAULT
                    </span>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {user.name}
                  <br />
                  {addr.address}
                  <br />
                  {addr.phone}
                </p>
              </div>
              <div className="flex gap-4 mt-6 text-sm font-medium underline-offset-4">
                <button className="underline hover:text-gray-600">Edit</button>
                <button className="underline hover:text-gray-600">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
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
        <div className="mb-10 md:hidden">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">
            My Account
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="md:sticky md:top-24">
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
