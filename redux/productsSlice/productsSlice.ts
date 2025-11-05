import { Item } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

interface ProductsSlice {
  products: Item[];
  page: number;
  size: number;
  showFilter: boolean;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedSort: string;
  inStock: boolean;
}

const initialState: ProductsSlice = {
  selectedBrands: [],
  page: 1,
  size: 10,
  selectedCategories: [],
  products: [],
  showFilter: false,
  inStock: false,
  selectedSort: "NO SELCT",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    toggleFilter: (state) => {
      state.showFilter = !state.showFilter;
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },

    setSelectedBrand: (state, action) => {
      state.selectedBrands = action.payload;
    },
    resetFilter: (state) => {
      state.selectedBrands = [];
      state.selectedCategories = [];
    },
    setInStock: (state, action) => {
      state.inStock = action.payload;
    },
    setSelectedSort: (state, action) => {
      state.selectedSort = action.payload;
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
    sort: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const {
  toggleFilter,
  setSelectedCategories,
  resetFilter,
  setProducts,
  setSelectedBrand,
  setPage,
  setSize,
  setInStock,
  setSelectedSort,
  sort,
} = productsSlice.actions;
export default productsSlice.reducer;
