import { configureStore } from "@reduxjs/toolkit";
import bagSlice from "@/redux/bagSlice/bagSlice";
import productsSlice from "@/redux/productsSlice/productsSlice";
import authSlice from "@/redux/authSlice/authSlice";
import headerSlice from "@/redux/headerSlice/headerSlice";
import categorySlice from "@/redux/categorySlice/categorySlice";
import dealsSlice from "@/redux/dealsSlice/dealsSlice";
import wishlistSlice from "@/redux/wishlistSlice/wishlistSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      bag: bagSlice,
      productsSlice,
      authSlice,
      headerSlice,
      categorySlice,
      dealsSlice,
      wishlist: wishlistSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
