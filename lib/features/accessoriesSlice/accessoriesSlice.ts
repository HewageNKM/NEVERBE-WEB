import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDocs, query} from "firebase/firestore";
import {accessoriesCollectionRef} from "@/firebase/Firebase";

interface Accessories{
    accessories: object[]
}

const initialState: Accessories = {
    accessories: []
}

const accessoriesSlice = createSlice({
    name: "accessoriesSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAccessories.fulfilled, (state, action) => {
            state.accessories = action.payload
        })
    }
})

export const getAccessories = createAsyncThunk(
    "accessoriesSlice/getAccessories",
    async (arg, thunkAPI) => {
        try {
            const getAccessoriesQuery = query(accessoriesCollectionRef);
            const doc = await getDocs(getAccessoriesQuery);
            return doc.docs.map(doc => doc.data());
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)

export default accessoriesSlice.reducer;