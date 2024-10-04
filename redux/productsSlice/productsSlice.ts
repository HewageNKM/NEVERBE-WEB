import {Item} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getInventory} from "@/firebase/serviceAPI";

interface ProductsSlice{
    products: Item[],
    showFilter: boolean,
    selectedType: string,
    selectedBrands: string[],
    selectedSizes: string[]
}

const initialState: ProductsSlice = {
    selectedBrands: [],
    selectedSizes: [],
    selectedType: "all",
    products: [],
    showFilter: false
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        toggleFilter: (state) => {
            state.showFilter = !state.showFilter;
        },
        setSelectedType: (state, action) => {
            state.selectedType = action.payload;
        },
        setSelectedBrands: (state, action) => {
            state.selectedBrands = action.payload;
        },
        setSelectedSizes: (state, action) => {
            state.selectedSizes = action.payload;
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

export const {toggleFilter,setSelectedBrands,setSelectedType,setSelectedSizes} = productsSlice.actions;
export default productsSlice.reducer;