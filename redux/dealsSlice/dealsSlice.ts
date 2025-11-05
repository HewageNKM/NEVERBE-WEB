import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/interfaces/Product";

interface DealsState {
  deals: Product[];
  page: number;
  size: number;
  total: number;
  inStock: boolean;
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSort: string;
  showFilter: boolean;
}

const initialState: DealsState = {
  deals: [],
  page: 1,
  size: 20,
  total: 0,
  inStock: false,
  selectedBrands: [],
  selectedCategories: [],
  selectedSort: "NO SELCT",
  showFilter: false,
};

const dealsSlice = createSlice({
  name: "dealsSlice",
  initialState,
  reducers: {
    setDeals(state, action: PayloadAction<Product[]>) {
      state.deals = action.payload;
    },
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
    resetFilter(state) {
      state.selectedBrands = [];
      state.selectedCategories = [];
      state.inStock = false;
    },
  },
});

export const {
  setDeals,
  setPage,
  setSize,
  setTotal,
  setInStock,
  setSelectedBrand,
  setSelectedCategories,
  setSelectedSort,
  toggleFilter,
  resetFilter,
} = dealsSlice.actions;

export default dealsSlice.reducer;
