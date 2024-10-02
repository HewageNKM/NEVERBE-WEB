'use client'
import React, {ReactNode, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import LoadingScreen from "@/components/LoadingScreen";
import {setLoading} from "@/redux/authSlice/authSlice";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AuthProvider = ({children}: { children: ReactNode }) => {
    // Todo
    const isLoading = useSelector((state: RootState) => state.authSlice.isLoading);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            dispatch(setLoading(false))
        }, 1000)
    });
    return (
        <>
            {isLoading ? <LoadingScreen/> :
                <div className="min-h-screen flex-col justify-between flex w-full">
                    <Header/>
                    {children}
                    <Footer/>
                </div>}
        </>
    );
};

export default AuthProvider;