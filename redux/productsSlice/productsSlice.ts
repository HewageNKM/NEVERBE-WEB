import {Item} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getInventory} from "@/firebase/serviceAPI";
import {WritableDraft} from "immer";

interface ProductsSlice {
    products: Item[],
    showFilter: boolean,
    selectedType: string,
    selectedManufacturers: string[],
    selectedSizes: string[],
    selectedSort: string
}

const initialState: ProductsSlice = {
    selectedManufacturers: [],
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
        setSelectedSizes: (state, action) => {
            state.selectedSizes = action.payload;
        },
        setSelectedSort: (state, action) => {
            state.selectedSort = action.payload;
        },
        setSelectedManufacturers: (state, action) => {
            state.selectedManufacturers = action.payload;
        },
        resetFilter: (state) => {
            state.selectedManufacturers = [];
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

            //ManufacturersFilter by brand
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

            //ManufacturersFilter by brand
            if (state.selectedManufacturers.length > 0) {
                state.products = state.products.filter((item) => state.selectedManufacturers.includes(item.manufacturer));
            }

            //ManufacturersFilter by size
            if (state.selectedSizes.length > 0) {
                state.products = state.products.filter((item) => item.variants.some((variant) => variant.sizes.some((size) => state.selectedSizes.includes(size.size))));
            }

            sort(state, action);
        }).addCase(sortProducts.fulfilled, (state, action) => {
            sort(state, action);
        });
    }
});

export const sort = (state: WritableDraft<ProductsSlice>, action: any) => {
    if (state.selectedSort != "") {
        if (state.selectedSort === "lh") {
            state.products = state.products.sort((a, b) => a.sellingPrice - b.sellingPrice);
        } else if (state.selectedSort === "hl") {
            state.products = state.products.sort((a, b) => b.sellingPrice - a.sellingPrice);
        } else if (state.selectedSort == "") {
            state.products = action.payload
        }
    }
}

export const filterProducts = createAsyncThunk('products/getFilterProducts', async (arg, thunkAPI) => {

    try {
        return await getInventory();
    } catch (e) {
        console.log(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const sortProducts = createAsyncThunk('products/getSortProductsByPrice', async (arg, thunkAPI) => {

    try {
        return await getInventory();
    } catch (e) {
        console.log(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const {
    toggleFilter,
    setSelectedType,
    setSelectedSizes,
    setSelectedSort,
    resetFilter,
    setProducts,
    setSelectedManufacturers,
} = productsSlice.actions;
export default productsSlice.reducer;
