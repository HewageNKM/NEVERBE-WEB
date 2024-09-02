import {createSlice} from "@reduxjs/toolkit";

interface FilterSlice{
    showFilter: boolean;
    inStock: boolean;
    selectedSizes: string[];
    selectedBrands: string[];
}

const initialFilterState: FilterSlice = {
    inStock: false,
    selectedBrands: [],
    selectedSizes: [],
    showFilter: false
}
export const filterSlice = createSlice({
    name: "filter",
    initialState: initialFilterState,
    reducers: {
        toggleFilter: (state) => {
            state.showFilter = !state.showFilter;
        }
    }
});

export const {toggleFilter} = filterSlice.actions;
export default filterSlice.reducer;

