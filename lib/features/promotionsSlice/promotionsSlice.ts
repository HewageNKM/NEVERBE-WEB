import {createSlice} from "@reduxjs/toolkit";

interface Promotions {
    promotions: []
}

const initialState: Promotions = {
    promotions: []
}

const promotionsSlice = createSlice(
    {
        name: "promotionsSlice",
        initialState,
        reducers: {}
    }
)

export default promotionsSlice.reducer
export const {} = promotionsSlice.actions