"use client";
import { ReactNode, useEffect, useState } from "react";
import { auth } from "@/firebase/firebaseClient";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { initializeCart } from "@/redux/cartSlice/cartSlice";
import { AnimatePresence } from "framer-motion";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "@/redux/authSlice/authSlice";
import Menu from "@/components/Menu";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const GlobalProvider = ({
  children,
  season,
}: {
  children: ReactNode;
  season: "christmas" | "newYear" | null;
}) => {
  const dispatch: AppDispatch = useDispatch();

  const showCart = useSelector((state: RootState) => state.cartSlice.showCart);
  const showMenu = useSelector(
    (state: RootState) => state.headerSlice.showMenu
  );

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setUser(user));
        console.log("User Logged In");
      } else {
        console.log("No User Logged In");
      }
    });
    dispatch(initializeCart());
  }, []);

  return (
    <main className="w-full relative flex flex-col justify-between min-h-screen overflow-clip">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <Header season={season} />
      {children}
      <Footer />
      <AnimatePresence>{showCart && <Cart />}</AnimatePresence>
      <AnimatePresence>{showMenu && <Menu />}</AnimatePresence>
      <Analytics />
      <SpeedInsights />
    </main>
  );
};

export default GlobalProvider;
