import React from "react";
import "@/app/globals.css"
import {GlobalProvider} from "@/context/GlobalProvider";

export default function App({Component, pageProps}) {
    return (
        <GlobalProvider>
            <Component {...pageProps}/>;
        </GlobalProvider>
    )
}