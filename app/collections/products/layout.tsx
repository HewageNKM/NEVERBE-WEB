"use client"
import React, {ReactNode} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {AnimatePresence} from "framer-motion";
import PopUpFilter from "@/app/collections/products/components/PopUpFilter";

const Layout = ({children}:{children:ReactNode}) => {
    const showFilter = useSelector((state:RootState) => state.productsSlice.showFilter);

    return (
        <div className="w-full relative">
            {children}
            <AnimatePresence>
                {showFilter && (<PopUpFilter />)}
            </AnimatePresence>
        </div>
    );
};

export default Layout;