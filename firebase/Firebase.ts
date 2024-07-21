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
    }).catch((err) => {
        console.error(err.message)
    });
}

export const getPopular = async () => {
    return [];
}

export const getAShoeById = async (shoeId: string) => {
    try {
        const getAShoeByIdQuery = query(shoesCollectionRef, where('shoeId', '==', shoeId));
        const doc = await getDocs(getAShoeByIdQuery);
        return doc.docs.map(doc => doc.data())[0];
    } catch (err) {
        console.log(err.message)
    }

}

export const getReviewsById = async (shoeId: string, lim: number) => {
    try {
        const getReviewsByIdQuery = query(reviewsCollectionRef, where('shoeId', '==', shoeId), limit(lim))
        const doc = await getDocs(getReviewsByIdQuery);
        return doc.docs.map(doc => doc.data());
    } catch (err) {
        console.error(err.message)
    }
}

export const getSimilarProducts = async (type: string) => {
    try {
        const getSimilarProducts = query(shoesCollectionRef, where('for', '==', type), limit(20))
        const doc = await getDocs(getSimilarProducts);
        return doc.docs.map(doc => doc.data());
    } catch (err) {
        console.error(err.message)
    }
}