import {Item} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getInventory} from "@/firebase/serviceAPI";

interface ProductsSlice {
    products: Item[],
    showFilter: boolean,
    selectedType: string,
    selectedBrands: string[],
    selectedSizes: string[],
    selectedSort: string
}

const initialState: ProductsSlice = {
    selectedBrands: [],
    selectedSizes: [],
    selectedType: "all",
    products: [],
    showFilter: false,
    selectedSort: ""
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
        },
        setSelectedSort: (state, action) => {
            state.selectedSort = action.payload;
        },
        resetFilter: (state) => {
            state.selectedBrands = [];
            state.selectedSizes = [];
            state.selectedType = "all";
            state.selectedSort = "";
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(filterProducts.fulfilled, (state, action) => {

            //Filter by brand
            if (state.selectedType == "all") {
                state.products = action.payload;
            } else if (state.selectedType == "shoes") {
                state.products = action.payload.filter((item) => item.type == "shoes");
            } else if (state.selectedType == "accessories") {
                state.products = action.payload.filter((item) => item.type == "accessories");
            } else if (state.selectedType == "slippers") {
                state.products = action.payload.filter((item) => item.type == "slippers");
            } else if (state.selectedType == "socks") {
                state.products = action.payload.filter((item) => item.type == "socks");
            }

            //Filter by brand
            if (state.selectedBrands.length > 0) {
                state.products = state.products.filter((item) => state.selectedBrands.includes(item.manufacturer));
            }

            //Filter by size
            if (state.selectedSizes.length > 0) {
                state.products = state.products.filter((item) => item.variants.some((variant) => variant.sizes.some((size) => state.selectedSizes.includes(size.size))));
            }

            if (state.selectedSort != "") {
                if (state.selectedSort === "lh") {
                    state.products = state.products.sort((a, b) => a.sellingPrice - b.sellingPrice);
                } else if (state.selectedSort === "hl") {
                    state.products = state.products.sort((a, b) => b.sellingPrice - a.sellingPrice);
                } else if (state.selectedSort == "") {
                    state.products = action.payload
                }
            }
        });
    }
});

export const filterProducts = createAsyncThunk('products/getFilterProducts', async (arg, thunkAPI) => {

    try {
        return await getInventory();
    } catch (e) {
        console.log(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const {
    toggleFilter,
    setSelectedBrands,
    setSelectedType,
    setSelectedSizes,
    setSelectedSort,
    resetFilter,
    setProducts
} = productsSlice.actions;
export default productsSlice.reducer;
