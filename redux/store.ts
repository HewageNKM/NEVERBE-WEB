import {configureStore} from '@reduxjs/toolkit'
import cartSlice from "@/redux/cartSlice/cartSlice";
import productsSlice from "@/redux/productsSlice/productsSlice";
import paymentSlice from "@/redux/paymentSlice/paymentSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cartSlice,
            productsSlice,
            paymentSlice
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(
            {serializableCheck: false}
        )
    })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']