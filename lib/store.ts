import {configureStore} from '@reduxjs/toolkit';
import authSlice from '@/lib/features/authSlice/authSlice';
import sliderSlice from "@/lib/features/sliderSlice/sliderSlice";
import arrivalsSlice from "@/lib/features/arrivalsSlice/arrivalSlice";
import shoeDetailsSlice from "@/lib/features/shoeDetailsSlice/shoeDetailsSlice";
import shoeReviewSlice from "@/lib/features/shoeReviewSlice/shoeReviewSlice";
import similarProductsSlice from "@/lib/features/similarProductsSlice/similarProductsSlice";
import headerSlice from "@/lib/features/headerSlice/headerSlice";
import promotionsSlice from "@/lib/features/promotionsSlice/promotionsSlice";
import accessoriesSlice from "@/lib/features/accessoriesSlice/accessoriesSlice";

export const store = configureStore({
    reducer: {
        authSlice,
        sliderSlice,
        arrivalsSlice,
        shoeDetailsSlice,
        shoeReviewSlice,
        similarProductsSlice,
        headerSlice,
        promotionsSlice,
        accessoriesSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
