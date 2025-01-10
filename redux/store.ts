import {configureStore} from '@reduxjs/toolkit'
import cartSlice from "@/redux/cartSlice/cartSlice";
import productsSlice from "@/redux/productsSlice/productsSlice";
import authSlice from "@/redux/authSlice/authSlice";
import manufacturerSlice from './manufacturerSlice/manufacturerSlice';
import brandSlice from "@/redux/brandSlice/brandSlice";
import headerSlice from "@/redux/headerSlice/headerSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cartSlice,
            productsSlice,
            authSlice,
            manufacturerSlice,
            brandSlice,
            headerSlice
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(
            {serializableCheck: false}
        )
    })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']