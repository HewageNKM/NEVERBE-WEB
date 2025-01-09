import {Order} from "@/interfaces";
import {getIdToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {postOrderURL} from "@/app/urls";

export const addNewOrder = async (newOrder: Order,captchaToken:string) => {
    try {
        const token = await getIdToken();
        return axios({
            method: 'post',
            url: postOrderURL+"?captchaToken="+captchaToken,
            data: JSON.stringify(newOrder),
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }catch (e) {
        throw e;
    }
}