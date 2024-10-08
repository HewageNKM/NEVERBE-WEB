import {initializeApp} from "firebase/app";
import {collection, getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getAnalytics, isSupported} from "@firebase/analytics";
import {getRemoteConfig} from "@firebase/remote-config";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export let analytics;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
}).catch((error) => {
    console.error("Analytics not supported:", error);
});
export const inventoryCollectionRef = collection(db, 'inventory');
export const slidersCollectionRef = collection(db, 'sliders');