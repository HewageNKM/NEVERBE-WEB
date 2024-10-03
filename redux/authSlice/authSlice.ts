import {User} from "@/interfaces";
import {createSlice} from "@reduxjs/toolkit";

interface AuthSlice {
    user: User | null;
    isLoading: boolean;
}

const initialState: AuthSlice = {
    user: null,
    isLoading: true
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setLoading(state, action) {
            state.isLoading = action.payload
        }
    }
});

export const {setUser, setLoading} = authSlice.actions;
export default authSlice.reducer;



