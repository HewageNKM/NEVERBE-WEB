import {auth} from "@/firebase/firebaseClient";
import axios from "axios";
import {brandsURL} from "@/app/urls";

export const getBrands = async () => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios({
            method: 'GET',
            url: brandsURL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (e) {
        throw e
    }
}