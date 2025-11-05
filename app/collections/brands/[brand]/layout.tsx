"use client"
import React, {ReactNode} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {AnimatePresence} from "framer-motion";
import {Analytics} from "@vercel/analytics/react";
import BrandTopUpFilter from "@/app/collections/brands/[brand]/components/BrandPopUpFilter";

const Layout = ({children}: { children: ReactNode }) => {
    const showFilter = useSelector((state: RootState) => state.brandSlice.showFilter);

    return (
        <div className="w-full relative">
            {children}
            <AnimatePresence>
                {showFilter && (<BrandTopUpFilter/>)}
            </AnimatePresence>
            <Analytics/>
        </div>
    );
};

export default Layout;