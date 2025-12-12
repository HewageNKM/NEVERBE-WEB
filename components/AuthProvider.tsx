"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseClient";
import { setUser } from "@/redux/authSlice/authSlice";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Serialize the user object (Redux doesn't like non-serializable data)
        const serializedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
        // We cast to any or User type depending on strictness,
        // but passing the full User object often causes serializable errors in Redux Toolkit.
        // However, existing slice expects 'User | null'.
        // If the slice defined User as the Firebase type, we might get warnings.
        // For now, let's pass it, but ideally we should map it.
        // Checking authSlice again... it imports User from @firebase/auth-types.
        // I'll try passing user directly first, as some setups preserve it (ignoring serializable check).
        dispatch(setUser(user as any));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
