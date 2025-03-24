import {Order} from "@/interfaces";
import {getIdToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {getOrdersURL, postOrderURL} from "@/app/urls";

export const addNewOrder = async (newOrder: Order, captchaToken: string) => {
    try {
        const token = await getIdToken();
        return axios({
            method: 'post',
            url: postOrderURL + "?captchaToken=" + captchaToken,
            data: JSON.stringify(newOrder),
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (e) {
        throw e;
    }
}

export const getOrdersByUserId = async (userId:string) => {
    try {
        const token = await getIdToken();
        const response = await axios({
            method: 'get',
            url: getOrdersURL + "?userId=" + userId,
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}