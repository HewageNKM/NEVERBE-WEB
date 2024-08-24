import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDocs, query} from "firebase/firestore";
import {shoesCollectionRef} from "@/firebase/Firebase";

interface ProductSlice {
    products: Shoe[];
}

const initialState: ProductSlice = {
    products: []
}
const productSlice = createSlice({
    name: "productSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getProducts.fulfilled, (state, action) => {
            // @ts-ignore
            state.products = action.payload
        })
    }
});

export const getProducts = createAsyncThunk("productSlice/fetchProducts", async (arg, thunkAPI) => {
    try {
        const newArr = query(shoesCollectionRef);
        const doc = await getDocs(newArr);
        return doc.docs.map(doc => doc.data());
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message)
    }
});

export default productSlice.reducer
export const {} = productSlice.actions