import {configureStore} from '@reduxjs/toolkit';
import authSlice from '@/lib/features/authSlice/authSlice';
import sliderSlice from "@/lib/features/sliderSlice/sliderSlice";
import arrivalsSlice from "@/lib/features/arrivalsSlice/arrivalSlice";

export const store = configureStore({
    reducer: {
        authSlice,
        sliderSlice,
        arrivalsSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
