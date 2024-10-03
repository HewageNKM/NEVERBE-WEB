import {Item} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getInventory} from "@/firebase/serviceAPI";

interface ProductsSlice{
    products: Item[],
    showFilter: boolean
}

const initialState: ProductsSlice = {
    products: [],
    showFilter: false
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        toggleFilter: (state) => {
            state.showFilter = !state.showFilter;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initializeProducts.fulfilled, (state, action) => {
            state.products = action.payload;
        })
    }
});

export const initializeProducts = createAsyncThunk('products/getProducts', async (arg, thunkAPI) => {
    try {
        return await getInventory();
    }catch (e) {
        console.log(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const {toggleFilter} = productsSlice.actions;
export default productsSlice.reducer;