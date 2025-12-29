import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DealsState {
  page: number;
  size: number;
  total: number;
  inStock: boolean;
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  selectedGender: string;
  selectedSort: string;
  showFilter: boolean;
}

const initialState: DealsState = {
  page: 1,
  size: 12,
  total: 0,
  inStock: false,
  selectedBrands: [],
  selectedCategories: [],
  selectedSizes: [],
  selectedGender: "",
  selectedSort: "NO SELCT",
  showFilter: false,
};

const dealsSlice = createSlice({
  name: "dealsSlice",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
    },
    setTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    setInStock(state, action: PayloadAction<boolean>) {
      state.inStock = action.payload;
    },
    setSelectedBrand(state, action: PayloadAction<string[]>) {
      state.selectedBrands = action.payload;
    },
    setSelectedCategories(state, action: PayloadAction<string[]>) {
      state.selectedCategories = action.payload;
    },
    setSelectedSort(state, action: PayloadAction<string>) {
      state.selectedSort = action.payload;
    },
    toggleFilter(state) {
      state.showFilter = !state.showFilter;
    },
    setSelectedSizes(state, action: PayloadAction<string[]>) {
      state.selectedSizes = action.payload;
    },
    setSelectedGender(state, action: PayloadAction<string>) {
      state.selectedGender = action.payload;
    },
    resetFilter(state) {
      state.selectedBrands = [];
      state.selectedCategories = [];
      state.selectedSizes = [];
      state.selectedGender = "";
      state.inStock = false;
    },
  },
});

export const {
  setPage,
  setSize,
  setTotal,
  setInStock,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSizes,
  setSelectedSort,
  toggleFilter,
  resetFilter,
  setSelectedGender,
} = dealsSlice.actions;

export default dealsSlice.reducer;
