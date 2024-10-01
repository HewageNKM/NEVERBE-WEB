import {auth} from "@/firebase/Config";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";


export const signAnonymousUser = async () => {
    return await signInAnonymously(auth);
};