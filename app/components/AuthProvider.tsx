"use client"
import React, {ReactNode, useEffect, useState} from 'react';
import {signUser} from "@/firebase/firebaseClient";
import LoadingScreen from "@/components/LoadingScreen";

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        signUser().then(()=>{
            setIsLoading(false)
        }).catch(()=>{
            setIsLoading(false)
        });
    });
    return (
        <>
            {isLoading ? <LoadingScreen/>:children}
        </>
    );
};

export default AuthProvider;