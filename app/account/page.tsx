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

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-10">
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

        <div className="flex flex-col gap-12">
          {/* Header & Nav */}
          <div className="sticky top-0 bg-white z-10 -mx-4 px-4 md:mx-0 md:px-0 border-b border-gray-100 pt-4 md:pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
              {/* Left: Logo/Title (Hidden on mobile as it's at top, shown on MD) */}
              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="relative w-24 h-12 block">
                  <Image
                    src={Logo}
                    alt="NEVERBE Logo"
                    fill
                    className="object-contain object-left"
                  />
                </Link>
                <div className="h-6 w-px bg-gray-200"></div>
                <h1 className="text-xl font-medium uppercase tracking-tight">
                  My Account
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-6 self-end md:self-auto">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  Return to Store
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "dashboard", label: "Profile" },
                { id: "orders", label: "Orders" },
                { id: "addresses", label: "Addresses" },
                { id: "details", label: "Settings" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap pb-3 text-lg transition-all border-b-2 ${
                    activeTab === item.id
                      ? "font-medium text-black border-black"
                      : "text-gray-500 border-transparent hover:text-black"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="min-h-[60vh] relative pt-4">
            {loading ? (
              <ComponentLoader />
            ) : !user ? (
              <div className="flex items-center justify-center h-64">
                <p>Please log in.</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
