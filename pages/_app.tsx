import React, {useEffect} from "react";
import "@/app/globals.css"
import {GlobalProvider} from "@/context/GlobalProvider";
import {Provider, useDispatch, useSelector} from "react-redux";
import {store} from "@/state/store";
import {getCurrentUser} from "@/state/features/authSlice/authSlice";

export default function App({Component, pageProps}) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser());
    },)
    return (
        <Provider store={store}>
            <GlobalProvider>
                <Component {...pageProps}/>;
            </GlobalProvider>
        </Provider>
    )
}