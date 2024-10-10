"use client"
import React, {ReactNode, useEffect} from 'react';
import {signUser} from "@/firebase/firebaseClient";

const AuthProvider = ({children}: { children: ReactNode }) => {
    useEffect(() => {
        signUser();
    });
    return (
        <>
            {children}
        </>
    );
};

export default AuthProvider;