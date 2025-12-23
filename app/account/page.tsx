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
} from "react-icons/io5";

const Account = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch();

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
    if (!loading && !user) {
      router.push("/account/login");
    }
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
        toast.success("Blueprint Synced with Google!");
      } catch (error: any) {
        toast.error(
          error.code === "auth/credential-already-in-use"
            ? "This Google ID is already linked to another blueprint."
            : "Sync failed: " + error.message
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark text-inverse selection:bg-accent selection:text-dark overflow-x-hidden">
      {/* Background Tech Grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#97e13e 1px, transparent 1px), linear-gradient(90deg, #97e13e 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-content mx-auto px-4 md:px-12 py-8 md:py-16 relative z-10">
        {/* Mobile Branding */}
        <div className="mb-12 md:hidden flex flex-col items-center">
          <Link href="/" className="mb-6 block">
            <Image
              src={Logo}
              width={100}
              height={40}
              alt="NEVERBE"
              className="invert brightness-200"
            />
          </Link>
          <div className="px-4 py-1 bg-accent text-dark text-[10px] font-black uppercase italic tracking-widest mb-2">
            Control Center
          </div>
          <h1 className="text-4xl font-display font-black uppercase italic tracking-tighter">
            My Account
          </h1>
        </div>

        <div className="flex flex-col gap-8 md:gap-16">
          {/* HEADER & NAV: Performance Bar */}
          <div className="sticky top-0 bg-dark/90 backdrop-blur-2xl z-50 -mx-4 px-4 md:mx-0 md:px-0 border-b border-white/5 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
              {/* Desktop Title Block */}
              <div className="hidden md:flex items-center gap-8">
                <Link
                  href="/"
                  className="relative w-28 h-8 block hover:scale-105 transition-transform"
                >
                  <Image
                    src={Logo}
                    alt="NEVERBE"
                    fill
                    className="object-contain object-left invert brightness-200"
                  />
                </Link>
                <div className="h-10 w-[1px] bg-white/10 -skew-x-12" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent italic">
                    Member Protocol
                  </span>
                  <h1 className="text-2xl font-display font-black uppercase italic tracking-tighter">
                    Account Dashboard
                  </h1>
                </div>
              </div>

              {/* Utility Actions */}
              <div className="flex items-center gap-8 self-end md:self-auto">
                <Link
                  href="/"
                  className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-inverse transition-colors"
                >
                  <IoArrowBackOutline className="group-hover:-translate-x-1 transition-transform" />
                  Store
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted hover:text-error transition-colors"
                >
                  <IoLogOutOutline
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  Term. Session
                </button>
              </div>
            </div>

            {/* Navigation Tabs: Skewed Performance Style */}
            <nav className="flex items-center gap-4 md:gap-10 overflow-x-auto hide-scrollbar pb-1">
              {[
                { id: "dashboard", label: "Profile" },
                { id: "orders", label: "Order History" },
                { id: "addresses", label: "Blueprints" },
                {
                  id: "details",
                  label: user?.isAnonymous ? "Initialize Account" : "Security",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap pb-4 text-sm md:text-base font-display font-bold uppercase transition-all relative ${
                    activeTab === item.id
                      ? "text-accent italic font-black"
                      : "text-muted hover:text-inverse"
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="accountTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-accent shadow-[0_0_15px_#97e13e]"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* MAIN CONTENT AREA */}
          <main className="min-h-[50vh] animate-fade">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <ComponentLoader />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent animate-pulse">
                  Syncing Protocols...
                </span>
              </div>
            ) : !user ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-2xl">
                <p className="font-display font-black uppercase italic text-muted">
                  Session Expired. Please Authenticate.
                </p>
              </div>
            ) : (
              <div className="max-w-5xl">
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
                  (user.isAnonymous ? (
                    <div className="flex flex-col items-center justify-start py-12 px-6 max-w-xl mx-auto text-center bg-surface-2 rounded-3xl border border-white/5 shadow-hover">
                      <div className="w-20 h-20 bg-accent text-dark rounded-full flex items-center justify-center mb-8 shadow-custom">
                        <IoShieldCheckmarkOutline size={40} />
                      </div>
                      <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter mb-4 text-inverse">
                        Finalize Your Member Blueprint
                      </h2>
                      <p className="text-muted mb-10 font-medium leading-relaxed">
                        You are currently using a guest protocol. Link your
                        Google account to secure your performance data, order
                        history, and saved blueprints permanently.
                      </p>

                      <button
                        onClick={handleGoogleLink}
                        className="group w-full bg-inverse text-dark flex items-center justify-center gap-4 py-5 rounded-full hover:bg-accent transition-all duration-300 shadow-custom active:scale-95"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                        <span className="text-sm font-black uppercase tracking-[0.2em]">
                          Sync with Google
                        </span>
                      </button>

                      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted italic">
                        Secured via NEVERBE Auth Protocol v2.5
                      </p>
                    </div>
                  ) : (
                    <AccountSettings user={user} dispatch={dispatch} />
                  ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
