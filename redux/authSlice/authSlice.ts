import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "@firebase/auth-types";

interface AuthSlice {
    user: User | null;
    showLoginForm: boolean;
}

const initialState: AuthSlice = {
    user: null,
    showLoginForm: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setShowLoginForm: (state, action: PayloadAction<boolean>) => {
            state.showLoginForm = action.payload;
        },
    },
});

export const {setUser,setShowLoginForm} = authSlice.actions;
export default authSlice.reducer;