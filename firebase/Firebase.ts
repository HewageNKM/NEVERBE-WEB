import {initializeApp} from "firebase/app";
import {collection, getDocs, getFirestore, limit, orderBy, query, where} from "firebase/firestore";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIRBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIRBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIRBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIRBASE_STORAGE_BUCKET_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIRBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIRBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIRBASE_MESSUREMENT_ID
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const usersCollectionRef = collection(db, 'users');
export const slidersCollectionRef = collection(db, 'sliders');
export const shoesCollectionRef = collection(db, 'shoes');
export const reviewsCollectionRef = collection(db, 'reviews')