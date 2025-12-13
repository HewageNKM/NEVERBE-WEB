"use client";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { setUser } from "@/redux/authSlice/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const serializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber,
          providerId: user.providerId,
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          memberSince: user.metadata.creationTime,
        };
        dispatch(setUser(serializableUser));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
};

export default AuthProvider;
