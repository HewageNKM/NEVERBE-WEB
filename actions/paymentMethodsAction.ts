import axios from "axios";
import {getPaymentMethodsURL} from "@/app/urls";

export const getWebsitePaymentMethods = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: getPaymentMethodsURL,
            headers: {
                "Origin": "https://www.neverbe.lk"
            }
        });
        return response.data;
    } catch (e) {
        throw e
    }
}