import {auth} from "@/firebase/firebaseClient";
import {Review} from "@/interfaces";
import axios from "axios";
import {reviewsURL} from "@/app/urls";

export const getAllReviewsById = async (itemId: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const uid = auth.currentUser?.uid;
        const res = await axios({
            method: 'GET',
            url: reviewsURL+'?itemId=' + itemId+"&userId="+uid,
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
            url: reviewsURL+'?recaptchaToken=' + recaptchaToken,

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
            url: reviewsURL+reviewId,
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