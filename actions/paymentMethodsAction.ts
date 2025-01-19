import axios from "axios";
import {getPaymentMethodsURL} from "@/app/urls";
import {getIdToken} from "@/firebase/firebaseClient";

export const getWebsitePaymentMethods = async () => {
    try {
        const token = await getIdToken();
        const response = await axios({
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
            url: getPaymentMethodsURL,
        });
        return response.data;
    } catch (e) {
        throw e
    }
}