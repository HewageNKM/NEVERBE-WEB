import {auth} from "@/firebase/firebaseClient";
import {Review} from "@/interfaces";
import axios from "axios";
import {reviewsURL} from "@/app/urls";

export const getAllReviewsById = async (itemId: string) => {
    try {
        const uid = auth.currentUser?.uid;
        const res = await axios({
            method: 'GET',
            url: reviewsURL+'?itemId=' + itemId+"&userId="+uid,
            headers:{
                "Origin": "https://www.neverbe.lk"
            }
        });
        return res.data;
    } catch (e) {
        throw e
    }
}
export const addNewReview = async (review: Review, recaptchaToken: string) => {
    try {
        const res = await axios({
            method: 'POST',
            url: reviewsURL+'?recaptchaToken=' + recaptchaToken,
            headers:{
                "Origin": "https://www.neverbe.lk"
            },
            data: review,
        });
        return res.data;
    } catch (e) {
        console.log(e)
        throw e
    }
}
export const deleteReview = async (reviewId: string) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: reviewsURL+`/${reviewId}`,
            headers:{
                "Origin": "https://www.neverbe.lk"
            }
        });
        return res.data;
    } catch (e) {
        throw e
    }
}