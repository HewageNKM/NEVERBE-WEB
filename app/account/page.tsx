"use client";
import React, { useState, useEffect } from "react";
import { signOut, updateProfile, updatePassword } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/authSlice/authSlice";

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
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData); // @ts-ignore

          // Fetch Addresses
          const addressesRef = collection(db, "users", user.uid, "addresses");
          const addressesSnapshot = await getDocs(addressesRef);
          const addressesData = addressesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAddresses(addressesData); // @ts-ignore
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // Wait a bit for auth to initialize if not yet present
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
        alert("Profile updated successfully!");

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
      alert("Error updating profile: " + err.message);
    }
  };

  const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAddress = {
      type: formData.get("type") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      phone: formData.get("phone") as string,
      default: formData.get("default") === "on",
      createdAt: new Date().toISOString(),
    };

    try {
      if (user?.uid) {
        // @ts-ignore
        const docRef = await addDoc(
          collection(db, "users", user.uid, "addresses"),
          newAddress
        );
        // @ts-ignore
        setAddresses([...addresses, { id: docRef.id, ...newAddress }]);
        setAddingAddress(false);
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error("Error adding address", error);
    }
  };

  const handleRemoveAddress = async (id) => {
    if (confirm("Are you sure you want to remove this address?")) {
      try {
        if (user?.uid) {
          // @ts-ignore
          await deleteDoc(doc(db, "users", user.uid, "addresses", id));
          // @ts-ignore
          setAddresses(addresses.filter((addr) => addr.id !== id));
        }
      } catch (error) {
        console.error("Error deleting address", error);
      }
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

  const AddressesView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-medium uppercase tracking-tight">
          Saved Addresses
        </h2>
        <button
          onClick={() => setAddingAddress(!addingAddress)}
          className="text-sm border-b border-black pb-0.5 hover:text-gray-600"
        >
          {addingAddress ? "Cancel" : "Add New"}
        </button>
      </div>

      {addingAddress && (
        <form
          onSubmit={handleAddAddress}
          className="bg-gray-50 p-6 border border-gray-200 space-y-4"
        >
          <h3 className="font-medium mb-4">New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="type"
              placeholder="Address Type (e.g. Home, Work)"
              required
              className="p-3 border w-full"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              required
              className="p-3 border w-full"
            />
          </div>
          <input
            name="address"
            placeholder="Address"
            required
            className="p-3 border w-full"
          />
          <input
            name="city"
            placeholder="City"
            required
            className="p-3 border w-full"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="default" />
            Set as default address
          </label>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 text-sm font-bold uppercase"
          >
            Save Address
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 && !addingAddress ? (
          <p className="text-gray-500">No addresses saved.</p>
        ) : (
          addresses.map((addr: any, idx) => (
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
                <button
                  onClick={() => handleRemoveAddress(addr.id)}
                  className="underline hover:text-gray-600"
                >
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
