'use client'
import React, {ReactNode, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import LoadingScreen from "@/components/LoadingScreen";
import {setLoading} from "@/redux/authSlice/authSlice";

const AuthProvider = ({children}:{children:ReactNode}) => {
    // Todo
    const isLoading = useSelector((state:RootState)=> state.authSlice.isLoading);
    const dispatch:AppDispatch = useDispatch();

    useEffect(() => {
        setTimeout(()=>{
            dispatch(setLoading(false))
        },3000)
    });
    return (
        <>
            {isLoading ? <LoadingScreen/> : children}
        </>
    );
};

export default AuthProvider;