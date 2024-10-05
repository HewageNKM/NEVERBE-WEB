"use client"
import React, {ReactNode, useEffect} from 'react';
import {signUser} from "@/firebase/serviceAPI";

const GlobalProvider = ({children}: { children: ReactNode }) => {
    useEffect(() => {
        signUser((user: any) => {
            if (user) {
                console.log('User is logged in:', user.uid);
            }
        });
    })

    return (
        <>
            {children}
        </>
    );
};

export default GlobalProvider;