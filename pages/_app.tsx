import React from "react";
import "@/style/globals.css"
import StoreProvider from "@/components/StoreProvider";

export default function App({Component, pageProps}: {
    pageProps: object;
    Component: any;
}) {
    return (
        <StoreProvider>
            <Component {...pageProps}/>;
        </StoreProvider>
    )
}