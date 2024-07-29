import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDocs, query, where} from "firebase/firestore";
import {reviewsCollectionRef} from "@/firebase/Firebase";

interface ShoeReview{
    reviewAddDialog:boolean,
    reviews: object[]
}

const initialState:ShoeReview = {
    reviewAddDialog:false,
    reviews:[]
}

const shoeReviewSlice = createSlice({
    name:"shoeReviewSlice",
    initialState,
    reducers:{
        openReviewDialog:(state) => {
            state.reviewAddDialog = true
        },
        closeReviewDialog:(state) => {
            state.reviewAddDialog = false
        }
    },
    extraReducers:(builder) => {
        builder.addCase(getReviews.fulfilled, (state,action) => {
            state.reviews = action.payload
        })
    }
})

export const getReviews = createAsyncThunk(
    "shoeReviewSlice/getReviews",
    async (shoeId:string,thunkAPI) => {
        try {
            const getReviewsQuery = query(reviewsCollectionRef, where('shoeId', '==', shoeId));
            const doc = await getDocs(getReviewsQuery);
            return doc.docs.map(doc => doc.data());
        } catch (err:any) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)
export const {openReviewDialog,closeReviewDialog} = shoeReviewSlice.actions;
export default shoeReviewSlice.reducer;