import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDocs, query, where} from "firebase/firestore";
import {shoesCollectionRef} from "@/firebase/Firebase";

interface ShoeDetails {
    shoeDetails: object,
    available: number,
    qty: number,
    selectedSize: number,
    selectedSlide: string
}

const initialState: ShoeDetails = {
    shoeDetails: {},
    available: 0,
    qty: 0,
    selectedSize: 0,
    selectedSlide: ""
}

const shoeDetailsSlice = createSlice({
    name: "shoeDetailsSlice",
    initialState,
    reducers: {
        setQuantity: (state, action) => {
            if (action.payload === "f") {
                // @ts-ignore
                if (state.qty + 1 > state.shoeDetails.stocks[state.selectedSize]) return;
                state.qty += 1;
                state.available -= 1;
            } else if (action.payload === "b") {
                if (state.qty <= 0) return;
                state.qty -= 1;
                state.available += 1;
            }
        },
        setAvailable: (state, action) => {
            state.available = action.payload;
        },
        setSelectedSize: (state, action) => {
            state.selectedSize = action.payload;
        },
        setSelectedSlide: (state, action) => {
            state.selectedSlide = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getShoeDetails.fulfilled, (state, action) => {
            state.shoeDetails = action.payload
        })
    }
})
export const getShoeDetails = createAsyncThunk(
    "shoeDetailsSlice/getShoeDetails",
    async (shoeId: string, thunkAPI) => {
        try {
            const getAShoeByIdQuery = query(shoesCollectionRef, where('shoeId', '==', shoeId));
            const doc = await getDocs(getAShoeByIdQuery);
            return doc.docs.map(doc => doc.data())[0];
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)
export const {setQuantity, setSelectedSize, setSelectedSlide, setAvailable} = shoeDetailsSlice.actions;
export default shoeDetailsSlice.reducer;