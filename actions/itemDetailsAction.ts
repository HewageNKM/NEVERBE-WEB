import {auth} from "@/firebase/firebaseClient";
import {Review} from "@/interfaces";
import axios from "axios";

export const getAllReviewsById = async (itemId: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const uid = auth.currentUser?.uid;
        const res = await axios({
            method: 'GET',
            url: '/api/v1/reviews?itemId=' + itemId+"&userId="+uid,
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
export const addNewReview = async (review: Review, recaptchaToken: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios({
            method: 'POST',
            url: '/api/v1/reviews?recaptchaToken=' + recaptchaToken,

            data: review,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (e) {
        console.log(e)
        throw e
    }
}
export const deleteReview = async (reviewId: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios({
            method: 'DELETE',
            url: '/api/v1/reviews/'+reviewId,
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