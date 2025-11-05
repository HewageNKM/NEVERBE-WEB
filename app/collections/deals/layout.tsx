"use client";

import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import DealsTopUpFilter from "./components/DealsTopUpFilter";

const DealsLayout = ({ children }: { children: ReactNode }) => {
  const showFilter = useSelector(
    (state: RootState) => state.dealsSlice.showFilter
  );

  return (
    <div className="w-full relative min-h-screen">
      {children}

      <AnimatePresence>
        {showFilter && <DealsTopUpFilter />}
      </AnimatePresence>
      <Analytics />
    </div>
  );
};

export default DealsLayout;
