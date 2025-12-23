"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { Logo } from "@/assets/images";
import Link from "next/link";
import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/navigation";
import ComponentLoader from "@/components/ComponentLoader";
import ProfileOverview from "./components/ProfileOverview";
import OrdersView from "./components/OrdersView";
import SavedAddresses from "./components/SavedAddresses";
import AccountSettings from "./components/AccountSettings";
import toast from "react-hot-toast";
import {
  IoLogOutOutline,
  IoArrowBackOutline,
  IoShieldCheckmarkOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";

const Account = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch();

  // ... (Data fetching logic remains identical)
  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        try {
          const ordersQuery = query(
            collection(db, "orders"),
            where("userId", "==", user.uid)
          );
          const ordersSnapshot = await getDocs(ordersQuery);
          const ordersData = ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);

          const token = await auth.currentUser?.getIdToken();
          const res = await fetch("/api/v1/customers/addresses", {
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
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push("/account/login");
  }, [loading, user, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleGoogleLink = async () => {
    const provider = new GoogleAuthProvider();
    if (auth.currentUser) {
      try {
        await linkWithPopup(auth.currentUser, provider);
        toast.success("Account synced with Google!");
      } catch (error: any) {
        toast.error("Sync failed: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#97e13e]/30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10 md:py-20">
        {/* TOP BAR: Navigation & Branding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Image
                src={Logo}
                width={120}
                height={40}
                alt="NEVERBE"
                priority
              />
            </Link>
            <div className="h-8 w-px bg-zinc-200 hidden md:block"></div>
            <h1 className="text-2xl font-display font-black uppercase tracking-tighter">
              Account
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center gap-2"
            >
              <IoArrowBackOutline size={16} /> Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-2"
            >
              Logout <IoLogOutOutline size={16} />
            </button>
          </div>
        </div>

        {/* PROFILE HEADER CARD */}
        {!loading && user && (
          <div className="bg-zinc-50 rounded-[2rem] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 border border-zinc-100">
            <div className="w-24 h-24 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-300 shadow-sm overflow-hidden">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <IoPersonCircleOutline size={80} />
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-1">
                {user.displayName || "Member"}
              </h2>
              <p className="text-zinc-500 font-medium text-sm">{user.email}</p>
            </div>
            <div className="md:ml-auto flex gap-3">
              <div className="bg-white px-6 py-3 rounded-2xl border border-zinc-200 shadow-sm text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Orders
                </p>
                <p className="font-display font-black text-xl">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION TABS: Clean Minimalist Style */}
        <div className="flex items-center gap-8 border-b border-zinc-100 mb-12 overflow-x-auto no-scrollbar">
          {[
            { id: "dashboard", label: "Overview" },
            { id: "orders", label: "My Orders" },
            { id: "addresses", label: "Addresses" },
            { id: "details", label: "Account Settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                activeTab === item.id
                  ? "text-black"
                  : "text-zinc-400 hover:text-black"
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#97e13e]"
                />
              )}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="animate-fade">
          {loading ? (
            <div className="flex justify-center py-20">
              <ComponentLoader />
            </div>
          ) : (
            <div className="max-w-4xl">
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
              {activeTab === "details" &&
                (user?.isAnonymous ? (
                  <div className="bg-zinc-50 rounded-[2.5rem] p-10 md:p-16 text-center border border-zinc-100 shadow-sm">
                    <IoShieldCheckmarkOutline
                      className="mx-auto text-[#97e13e] mb-6"
                      size={60}
                    />
                    <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-4">
                      Secure your profile
                    </h2>
                    <p className="text-zinc-500 max-w-md mx-auto mb-10 font-medium">
                      Link your Google account to save your orders and profile
                      permanently.
                    </p>
                    <button
                      onClick={handleGoogleLink}
                      className="inline-flex items-center justify-center gap-4 bg-black text-white px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#97e13e] hover:text-black transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                      <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1">
                        <svg viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      </span>
                      Sync with Google
                    </button>
                  </div>
                ) : (
                  <AccountSettings user={user} dispatch={dispatch} />
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;
