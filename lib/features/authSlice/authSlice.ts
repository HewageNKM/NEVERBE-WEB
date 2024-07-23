import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from "@/firebase/Firebase";

interface AuthSlice {
    user: object | null;
    isLoggedIn: boolean;
    status: string;
    state:boolean
    error: any;
}

const initialState: AuthSlice = {
    isLoggedIn: false,
    state:false,
    user: null,
    status: 'idle',
    error: null
}

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string, password: string }, thunkAPI) => {
        try {
            const usr = await signInWithEmailAndPassword(auth, email, password);
            return usr.user;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            await signOut(auth);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getCurrentUser: (state) => {
            state.user = auth.currentUser;
            state.status = 'fulfilled';
        },
        setState:(state,action) => {
            state.state = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoggedIn = true;
                state.status = 'fulfilled';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.error = action.payload;
                state.status = 'rejected';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.error = null;
                state.isLoggedIn = false;
                state.status = 'idle';
            });
    }
});

export const { getCurrentUser,setState } = authSlice.actions;
export default authSlice.reducer;
