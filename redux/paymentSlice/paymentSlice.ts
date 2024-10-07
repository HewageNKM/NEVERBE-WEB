import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface PaymentSlice {
    status: "COMPLETE" | "PENDING" | "FAILED";
    error: string | null;
    selectedPaymentMethod: "COD" | "PAYHERE";
}

const initialState: PaymentSlice = {
    status: "PENDING",
    error: null,
    selectedPaymentMethod: "COD",
};

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setPaymentMethod(state, action: PayloadAction<"COD" | "PAYHERE">) {
            state.selectedPaymentMethod = action.payload;
        },
        setPaymentStatus(state, action: PayloadAction<"COMPLETE" | "PENDING" | "FAILED">) {
            state.status = action.payload;
        },
        setPaymentError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
    },
});


export const {setPaymentMethod, setPaymentStatus, setPaymentError} = paymentSlice.actions;
export default paymentSlice.reducer;