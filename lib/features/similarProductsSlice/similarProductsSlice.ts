import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {shoesCollectionRef} from "@/firebase/Firebase";
import {getDocs, limit, query, where} from "firebase/firestore";


interface SimilarProducts {
    similarProducts: object[]
}

const initialState: SimilarProducts = {
    similarProducts: []
}

const similarProductsSlice = createSlice({
    name: "similarProductsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSimilarProducts.fulfilled, (state, action) => {
            state.similarProducts = action.payload ? action.payload : []
        })
    }
})
export const getSimilarProducts = createAsyncThunk(
    "similarProductsSlice/getSimilarProducts",
    async (type: string, thunkAPI) => {
        try {
            const products = query(shoesCollectionRef, where('for', '==', type), limit(20))
            const doc = await getDocs(products);
            return doc.docs.map(doc => doc.data())
        } catch (err: any) {
            console.error(err.message)
        }
    }
)

export default similarProductsSlice.reducer;