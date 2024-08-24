import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDocs, query} from "firebase/firestore";
import {shopCollectionRef} from "@/firebase/Firebase";

interface FooterSlice{
    shops:Shop[]
}

const initialState:FooterSlice = {
    shops:[]
}

const footerSlice = createSlice({
    name:"footerSlice",
    initialState,
    reducers:{},
    extraReducers:builder => {
        builder.addCase(getShops.fulfilled, (state, action) => {
            state.shops = action.payload;
        })
    }
})

export const getShops = createAsyncThunk("footerSlice/fetchShops", async (arg, thunkAPI) => {
    try {
        const newArr = query(shopCollectionRef);
        const doc = await getDocs(newArr);
        return doc.docs.map(doc => doc.data());
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export default footerSlice.reducer;

