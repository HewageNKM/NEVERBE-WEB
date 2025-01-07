"use client"
import React, {ReactNode} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {AnimatePresence} from "framer-motion";
import Filter from "@/app/collections/products/components/Filter";
import { Analytics } from "@vercel/analytics/react";

const Layout = ({children}:{children:ReactNode}) => {
    const showFilter = useSelector((state:RootState) => state.productsSlice.showFilter);

    return (
        <div className="w-full relative">
            {children}
            <AnimatePresence>
                {showFilter && (<Filter />)}
            </AnimatePresence>
            <Analytics />
        </div>
    );
};

export default Layout;