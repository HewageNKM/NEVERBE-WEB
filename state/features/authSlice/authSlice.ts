import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {auth} from "@/firebase/Firebase";

interface AuthSlice {
    user: object | null;
    status: string;
    error: any;
}

const initialState: AuthSlice = {
    user: null,
    status: 'idle',
    error: null
}

const authSlice = createSlice({
    initialState,
    name: 'auth',
    reducers: {
        getCurrentUser: (state) => {
            state.user = auth.currentUser;
            state.status = 'fulfilled'
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = 'fulfilled'
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.status = 'rejected'
            }).addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.error = null;
            state.status = 'idle'
        });
    }
});

const loginUser = createAsyncThunk(
    'auth/login',
    async ({email, password}: { email: string, password: string }, thunkAPI) => {
        try {
            const usr = await signInWithEmailAndPassword(auth, email, password);
            return usr.user;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)

const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            await signOut(auth);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)
export const {getCurrentUser} = authSlice.actions;
export default authSlice.reducer;


