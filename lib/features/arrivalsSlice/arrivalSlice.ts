import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDocs, limit, orderBy, query} from "firebase/firestore";
import {shoesCollectionRef} from "@/firebase/Firebase";

interface ArrivalsSlice{
    arrivals: object[]
}

const initialState:ArrivalsSlice = {
    arrivals:[]
}

const arrivalsSlice = createSlice({
    name:"arrivalsSlice",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getArrivals.fulfilled,(state,action)=>{
            state.arrivals = action.payload
        })
    }
})

export const getArrivals = createAsyncThunk(
    "arrivalsSlice/getArrivals",
    async (arg, thunkAPI) => {
        try {
            const newArr = query(shoesCollectionRef, orderBy('createdAt', 'desc'), limit(10));
            const doc = await getDocs(newArr);
            return doc.docs.map(doc => doc.data());
        }catch (error:any){
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export default arrivalsSlice.reducer
