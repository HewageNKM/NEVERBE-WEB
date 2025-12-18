import { Item } from "@/interfaces/BagItem";
import { createSlice } from "@reduxjs/toolkit";

interface BrandSlice {
  products: Item[];
  showFilter: boolean;
  selectedSort: string;
  selectedCategories: string[];
  selectedSizes: string[];
  inStock: boolean;
  page: number;
  size: number;
}

const initialState: BrandSlice = {
  page: 1,
  size: 12,
  products: [],
  inStock: false,
  showFilter: false,
  selectedCategories: [],
  selectedSizes: [],
  selectedSort: "NO SELCT",
};

const brandSlice = createSlice({
  name: "brandSlice",
  initialState,
  reducers: {
    toggleFilter: (state) => {
      state.showFilter = !state.showFilter;
    },
    setSelectedSort: (state, action) => {
      state.selectedSort = action.payload;
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    resetFilter: (state) => {
      state.selectedSort = "";
      state.selectedCategories = [];
      state.selectedSizes = [];
    },
    setSelectedSizes: (state, action) => {
      state.selectedSizes = action.payload;
    },
    setInStock: (state, action) => {
      state.inStock = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
  },
});
export const {
  toggleFilter,
  resetFilter,
  setSelectedSort,
  setProducts,
  setSize,
  setPage,
  setInStock,
  setSelectedCategories,
  setSelectedSizes,
} = brandSlice.actions;

export default brandSlice.reducer;
