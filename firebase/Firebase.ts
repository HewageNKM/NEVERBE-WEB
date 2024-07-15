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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const usersCollectionRef = collection(db, 'users');
const slidersCollectionRef = collection(db, 'sliders');
const shoesCollectionRef = collection(db, 'shoes');


export const createUser = async (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user;
        })
        .catch((error) => {
            throw new Error(error);
        });
}

export const signInWithEmailPassword = async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user;
        })
        .catch((error) => {
            return new Error(error);
        });
}

export const logOut = async () => {
    signOut(auth).then(() => {
        return true;
    }).catch((error) => {
        throw new Error(error);
    });
}

export const getSliders = async () => {
    const getAllSlides = query(slidersCollectionRef,limit(8));
    const doc = await getDocs(getAllSlides);
    return doc.docs.map(doc => doc.data());
}

export const getCurrentUser = async () => {
    return auth.currentUser;
}

export const getPopular = async () => {
    return [];
}
export const getNewArrival = async () => {
    const newArr = query(shoesCollectionRef, orderBy('createdAt', 'desc'), limit(10));
    const doc = await getDocs(newArr);
    return doc.docs.map(doc => doc.data());
}

export const getAShoeById = async (shoeId:string) => {
    console.log("Shoe Id: "+shoeId)
    const getAShoeByIdQuery = query(shoesCollectionRef, where('shoeId', '==',shoeId), limit(1));
    const doc = await getDocs(getAShoeByIdQuery);
    console.log(doc.docs.map(doc => doc.data())[0])
    return doc.docs.map(doc => doc.data())[0];
}

export const getReviewsById = async (shoeId:string) => {

}