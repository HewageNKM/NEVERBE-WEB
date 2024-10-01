import {configureStore} from '@reduxjs/toolkit'
import authSlice from "@/redux/authSlice/authSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            authSlice
        },
    })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']