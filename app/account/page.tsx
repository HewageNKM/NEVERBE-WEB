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
  GoogleAuthProvider,
  linkWithPopup,
  signInWithPopup,
} from "firebase/auth";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/navigation";
import ComponentLoader from "@/components/ComponentLoader";
import ProfileOverview from "./components/ProfileOverview";
import OrdersView from "./components/OrdersView";
import SavedAddresses from "./components/SavedAddresses";
import AccountSettings from "./components/AccountSettings";
import { toast } from "react-toastify";

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

  const handleGoogleLink = async () => {
    const provider = new GoogleAuthProvider();
    if (auth.currentUser) {
      try {
        await linkWithPopup(auth.currentUser, provider);
        toast.success("Account successfully linked with Google!");
      } catch (error: any) {
        if (error.code === "auth/credential-already-in-use") {
          toast.error(
            "This Google account is already in use. Please log out and sign in with Google."
          );
        } else {
          toast.error("Failed to link account: " + error.message);
        }
      }
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
                {
                  id: "details",
                  label: user?.isAnonymous ? "Sign In" : "Settings",
                },
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
                {activeTab === "details" &&
                  (user.isAnonymous ? (
                    <div className="flex flex-col items-center justify-start py-12 px-4 max-w-md mx-auto text-center animate-fadeIn">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold uppercase tracking-tight mb-3">
                        Save Your Account
                      </h2>
                      <p className="text-gray-500 mb-8 leading-relaxed">
                        You are currently using a guest account. Connect with
                        Google to save your order history and profile
                        permanently.
                      </p>
                      <button
                        onClick={handleGoogleLink}
                        className="w-full border border-gray-300 flex items-center justify-center gap-3 py-3 hover:border-black transition-colors bg-white shadow-sm"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                        <span className="text-sm font-medium text-gray-600">
                          Continue with Google
                        </span>
                      </button>
                    </div>
                  ) : (
                    <AccountSettings user={user} dispatch={dispatch} />
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
