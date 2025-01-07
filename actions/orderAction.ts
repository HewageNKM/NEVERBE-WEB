import {Order} from "@/interfaces";
import {getIdToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {postOrder} from "@/app/urls";

export const addNewOrder = async (newOrder: Order,) => {
    const token = await getIdToken();
    return axios({
        method: 'post',
        url: postOrder,
        data: JSON.stringify(newOrder),

        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}