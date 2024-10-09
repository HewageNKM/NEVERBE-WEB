import {initializeApp} from "firebase/app";
import {collection, getFirestore} from "firebase/firestore";
import {getAnalytics, isSupported} from "@firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
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