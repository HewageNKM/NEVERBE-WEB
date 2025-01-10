import {Item} from "@/interfaces";
import {WritableDraft} from "immer";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getInventoryByManufacturer} from "@/actions/inventoryAction";

interface ManufacturerSlice {
    products: Item[];
    isLoading: boolean;
    error: string | null;
    showFilter: boolean,
    selectedType: string,
    selectedManufacturers: string[],
    selectedSizes: string[],
    selectedSort: string
}

const initialState: ManufacturerSlice = {
    selectedManufacturers: [],
    selectedSizes: [],
    error: null,
    isLoading: false,
    selectedType: "all",
    products: [],
    showFilter: false,
    selectedSort: ""
}

const manufacturerSlice = createSlice({
    name: 'manufacturerSlice',
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
        builder
            .addCase(getItemsByManufacturer.pending, (state) => {state.isLoading = true;}
        ).addCase(getItemsByManufacturer.fulfilled, (state, action) => {
            //ManufacturersFilter by brand
            if (state.selectedType == "all") {
                state.products = action.payload;
            } else if (state.selectedType == "shoes") {
                state.products = action.payload.filter((item: Item) => item.type == "shoes");
            } else if (state.selectedType == "accessories") {
                state.products = action.payload.filter((item: Item) => item.type == "accessories");
            } else if (state.selectedType == "sandals") {
                state.products = action.payload.filter((item: Item) => item.type == "sandals");
            }

            //ManufacturersFilter by size
            if (state.selectedSizes.length > 0) {
                state.products = state.products.filter((item) => item.variants.some((variant) => variant.sizes.some((size) => state.selectedSizes.includes(size.size))));
            }
            sort(state, action);
            state.isLoading = false;
            state.error = null;
        }).addCase(getItemsByManufacturer.rejected, (state, action) => {
            state.error = action.error.message || "Something went wrong";
            state.isLoading = false;
        })
    }
});
export const sort = (state: WritableDraft<ManufacturerSlice>, action: any) => {
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

export const getItemsByManufacturer = createAsyncThunk('products/getItemByManufacturer', async (name:string, thunkAPI) => {
    try {
        return await getInventoryByManufacturer(name);
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
} = manufacturerSlice.actions;
export default manufacturerSlice.reducer;

