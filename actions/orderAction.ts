import {Order} from "@/interfaces";
import {getIdToken} from "@/firebase/firebaseClient";
import axios from "axios";

export const addNewOrder = async (newOrder: Order,) => {
    const token = await getIdToken();
    return axios({
        method: 'post',
        url: "/api/orders",
        data: JSON.stringify(newOrder),

        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}