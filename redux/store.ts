import {configureStore} from '@reduxjs/toolkit'
import authSlice from "@/redux/authSlice/authSlice";
import cartSlice from "@/redux/cartSlice/cartSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            authSlice,
            cartSlice
        },
    })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']