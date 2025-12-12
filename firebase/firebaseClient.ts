"use client";
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs } from "firebase/firestore";
import { getAnalytics, isSupported } from "@firebase/analytics";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { Item } from "@/interfaces";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const clientApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(clientApp);
export const db = getFirestore(clientApp);

let analytics;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(clientApp);
    }
  })
  .catch((error) => {
    console.error("Analytics not supported:", error);
  });

export const signUser = async () => {
  let user = await signInAnonymously(auth);
  console.log("User Signed In: ", user.user.uid);
  return user.user;
};

export const getIdToken = async () => {
  return auth.currentUser?.getIdToken();
};
