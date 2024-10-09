import {configureStore} from '@reduxjs/toolkit'
import cartSlice from "@/redux/cartSlice/cartSlice";
import productsSlice from "@/redux/productsSlice/productsSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cartSlice,
            productsSlice
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(
            {serializableCheck: false}
        )
    })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']