"use client";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AnimatePresence } from "framer-motion";
import BrandTopUpFilter from "./components/BrandTopUpFilter";

const Layout = ({ children }: { children: ReactNode }) => {
  const showFilter = useSelector(
    (state: RootState) => state.brandSlice.showFilter
  );

  return (
    <div className="w-full relative">
      {children}
      <AnimatePresence>{showFilter && <BrandTopUpFilter />}</AnimatePresence>
    </div>
  );
};

export default Layout;
