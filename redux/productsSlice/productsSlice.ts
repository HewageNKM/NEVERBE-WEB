import {Item} from "@/interfaces";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {WritableDraft} from "immer";
import {getProducts} from "@/actions/inventoryAction";

interface ProductsSlice {
    products: Item[],
    page: number,
    size: number,
    showFilter: boolean,
    isLoading: boolean,
    selectedType: string,
    error: string | null,
    selectedManufacturers: string[],
    selectedSizes: string[],
    selectedSort: string
}

const initialState: ProductsSlice = {
    selectedManufacturers: [],
    page: 1,
    size: 20,
    isLoading: false,
    error: null,
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
        },
        setPage: (state, action) => {
            state.size = action.payload;
        },
        setSize: (state, action) => {
            state.size = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getInventory.fulfilled, (state, action) => {

            //ManufacturersFilter by brand
            if (state.selectedType == "all") {
                state.products = action.payload;
            } else if (state.selectedType == "shoes") {
                state.products = action.payload.filter((item) => item.type == "shoes");
            } else if (state.selectedType == "accessories") {
                state.products = action.payload.filter((item) => item.type == "accessories");
            } else if (state.selectedType == "sandals") {
                state.products = action.payload.filter((item) => item.type == "sandals");
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
            state.isLoading = false;
            state.error = null;
        }).addCase(getInventory.pending, (state) => {
            state.isLoading = true
        }).addCase(getInventory.rejected, (state, action) => {
            state.error = action.error.message || null;
            state.isLoading = false;
        })
    }
});

const sort = (state: WritableDraft<ProductsSlice>, action: any) => {
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

export const getInventory = createAsyncThunk('products/getFilterProducts', async ({gender,page}:{gender:string,page:number}, thunkAPI) => {
    try {
        return await getProducts(gender,page);
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
    setPage,
    setSize
} = productsSlice.actions;
export default productsSlice.reducer;
