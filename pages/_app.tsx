import React from "react";
import "@/style/globals.css"
import StoreProvider from "@/components/StoreProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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