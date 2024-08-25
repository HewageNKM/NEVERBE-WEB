import React, {useEffect} from "react";
import "@/style/globals.css"
import StoreProvider from "@/pages/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {AppDispatch, RootState} from "@/lib/store";
import {useDispatch, useSelector} from "react-redux";
import {setCart} from "@/lib/features/cartSlice/cartSlice";

export default function App({Component, pageProps}: {
    pageProps: object;
    Component: any;
}) {
    return (
        <StoreProvider>
            <Header containerStyles="px-4 py-4"/>
            <Component {...pageProps}/>
            <Footer/>
        </StoreProvider>
    )
}