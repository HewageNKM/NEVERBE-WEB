import {Item} from "@/interfaces";
import {WritableDraft} from "immer";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getInventoryByTwoFields} from "@/actions/inventoryAction";

interface BrandSlice {
    products: Item[];
    isLoading: boolean;
    error: string | null;
    showFilter: boolean,
    selectedSizes: string[],
    selectedSort: string
}

const initialState: BrandSlice = {
    selectedSizes: [],
    error: null,
    isLoading: false,
    products: [],
    showFilter: false,
    selectedSort: ""
}

const brandSlice = createSlice({
    name: 'brandSlice',
    initialState,
    reducers: {
        toggleFilter: (state) => {
            state.showFilter = !state.showFilter;
        },
        setSelectedSizes: (state, action) => {
            state.selectedSizes = action.payload;
        },
        setSelectedSort: (state, action) => {
            state.selectedSort = action.payload;
        },
        resetFilter: (state) => {
            state.selectedSizes = [];
            state.selectedSort = "";
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(getItemsByTwoField.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getItemsByTwoField.fulfilled, (state, action) => {
                if (state.selectedSizes.length > 0) {
                    state.products = state.products.filter((item) => item.variants.some((variant) => variant.sizes.some((size) => state.selectedSizes.includes(size.size))));
                }
                sort(state, action);
                state.isLoading = false;
                state.error = null;
            })
            .addCase(getItemsByTwoField.rejected, (state, action) => {
                state.error = action.error.message || "Something went wrong";
                state.isLoading = false;
            })
    }
});
export const sort = (state: WritableDraft<BrandSlice>, action: any) => {
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

export const getItemsByTwoField = createAsyncThunk('products/getItemByManufacturer', async ({
                                                                                                value1,
                                                                                                value2,
                                                                                                field1,
                                                                                                field2
                                                                                            }: {
    value1: string,
    value2: string,
    field1: string,
    field2: string
}, thunkAPI) => {
    try {
        return await getInventoryByTwoFields(value1, value2, field1, field2);
    } catch (e) {
        console.log(e);
        return thunkAPI.rejectWithValue(e);
    }
});
export const {
    toggleFilter,
    setSelectedSizes,
    resetFilter,
    setSelectedSort,
    setProducts,
} = brandSlice.actions;
export default brandSlice.reducer;

