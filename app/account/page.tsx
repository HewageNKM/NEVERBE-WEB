"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/authSlice/authSlice";
import Image from "next/image";
import { Logo } from "@/assets/images";
import Link from "next/link";
import {
  updatePassword,
  updateProfile,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"; // Remove unused imports from here since they moved to sub-components
import { signOut } from "@firebase/auth";
import { useRouter } from "next/navigation";
import ComponentLoader from "@/components/ComponentLoader";
import ProfileOverview from "./components/ProfileOverview";
import OrdersView from "./components/OrdersView";
import SavedAddresses from "./components/SavedAddresses";
import AccountSettings from "./components/AccountSettings";

const Account = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
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
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // --- Loading State ---
  if (loading) return <ComponentLoader />;
  if (!user) {
    // Ideally redirect or show login
    if (typeof window !== "undefined") window.location.href = "/account/login";
    return null;
  }

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="mb-10 md:hidden flex flex-col items-center text-center">
          <Link href="/" className="relative mb-4 block w-24 h-24">
            <Image
              src={Logo}
              width={100}
              height={100}
              alt="NEVERBE Logo"
              className="object-contain w-full h-full"
            />
          </Link>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">
            My Account
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="md:sticky md:top-24">
              <Link
                href="/"
                className="hidden md:block w-32 h-16 relative mb-8"
              >
                <Image
                  src={Logo}
                  alt="NEVERBE Logo"
                  fill
                  className="object-contain object-left hover:opacity-80 transition-opacity"
                />
              </Link>
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
                <div className="pt-4 md:pt-0 border-t md:border-none border-gray-100 flex flex-col items-start">
                  <Link
                    href="/"
                    className="text-left text-lg text-gray-500 hover:text-black mt-4 whitespace-nowrap hidden md:block"
                  >
                    ← Back to Store
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-lg text-gray-400 hover:text-gray-600 mt-4"
                  >
                    Log Out
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-[60vh]">
            {activeTab === "dashboard" && (
              <ProfileOverview
                user={user}
                setActiveTab={setActiveTab}
                ordersCount={orders.length}
              />
            )}
            {activeTab === "orders" && <OrdersView orders={orders} />}
            {activeTab === "addresses" && (
              <SavedAddresses
                addresses={addresses}
                setAddresses={setAddresses}
                user={user}
              />
            )}
            {activeTab === "details" && (
              <AccountSettings user={user} dispatch={dispatch} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
