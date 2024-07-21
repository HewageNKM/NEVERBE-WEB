import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getDocs, limit, query} from "firebase/firestore";
import {slidersCollectionRef} from "@/firebase/Firebase";

interface SliderSlice {
    sliders: null | object[],
    isLoading: boolean
}

const initialState: SliderSlice = {
    sliders: [],
    isLoading: true
}
const sliderSlice = createSlice({
    initialState,
    name: 'slider',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSliders.fulfilled, (state, action) => {
            state.sliders = action.payload;
            state.isLoading = false;
        });
    }
});

export const getSliders = createAsyncThunk(
    "slider/getSliders",
    async (arg, thunkAPI) => {
        try {
            const getAllSlides = query(slidersCollectionRef, limit(8));
            const doc = await getDocs(getAllSlides);
            return doc.docs.map(doc => doc.data());
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);

export default sliderSlice.reducer;
export const {} = sliderSlice.actions