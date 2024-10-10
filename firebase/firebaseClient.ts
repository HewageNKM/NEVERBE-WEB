"use client"
import {getApp, getApps, initializeApp} from "firebase/app";
import {collection, getFirestore} from "firebase/firestore";
import {getAnalytics, isSupported} from "@firebase/analytics";
import {getDocs} from "@firebase/firestore";
import {Item} from "@/interfaces";
import {getAuth,onAuthStateChanged,signInAnonymously} from "firebase/auth";

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
const db = getFirestore(clientApp);
const auth = getAuth(clientApp);

let analytics;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(clientApp);
    }
}).catch((error) => {
    console.error("Analytics not supported:", error);
});

const inventoryCollectionRef = collection(db, 'inventory');


export const getInventory = async () => {
    let docs = await getDocs(inventoryCollectionRef);
    let items: Item[] = [];
    docs.forEach(doc => {
        const itemData = doc.data();
        items.push({
            ...itemData,
            createdAt: itemData.createdAt.toDate().toISOString(), // Convert to ISO string
        } as Item);
    })

    return items;
}

export const signUser =  async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            console.log("User Exist:"+uid);
        } else {
            const user = await signInAnonymously(auth);
            console.log("New User Logged: " +user.user.uid);
        }
    })
}

export const getIdToken = async () => {
    return auth.currentUser?.getIdToken();
}


