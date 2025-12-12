"use client";
import { ReactNode, useEffect } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { initializeBag } from "@/redux/bagSlice/bagSlice";
import { AnimatePresence } from "framer-motion";
import Bag from "@/components/Bag";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

  const showBag = useSelector((state: RootState) => state.bagSlice.showBag);
  const showMenu = useSelector(
    (state: RootState) => state.headerSlice.showMenu
  );

  useEffect(() => {
    dispatch(initializeBag());
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
      <AnimatePresence>{showBag && <Bag />}</AnimatePresence>
      <AnimatePresence>{showMenu && <Menu />}</AnimatePresence>
      <Analytics />
      <SpeedInsights />
    </main>
  );
};

export default GlobalProvider;
