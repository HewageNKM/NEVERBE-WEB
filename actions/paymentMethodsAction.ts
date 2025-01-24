import axios from "axios";
import {getPaymentMethodsURL} from "@/app/urls";

export const getWebsitePaymentMethods = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: getPaymentMethodsURL,
        });
        return response.data;
    } catch (e) {
        throw e
    }
}