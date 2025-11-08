"use client";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AnimatePresence } from "framer-motion";
import CategoryPopUpFilter from "@/app/collections/categories/[category]/components/CategoryPopUpFilter";

const Layout = ({ children }: { children: ReactNode }) => {
  const showFilter = useSelector(
    (state: RootState) => state.categorySlice.showFilter
  );

  return (
    <div className="w-full relative">
      {children}
      <AnimatePresence>{showFilter && <CategoryPopUpFilter />}</AnimatePresence>
    </div>
  );
};

export default Layout;
