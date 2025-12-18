"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/interfaces/Product";

export interface CategoryFilterState {
  showFilter: boolean;
  selectedBrands: string[]; // brand filter
  selectedSizes: string[]; // size filter
  inStock: boolean;
  products: Product[];
  page: number;
  size: number;
  selectedSort: string;
}

const initialState: CategoryFilterState = {
  showFilter: false,
  selectedBrands: [],
  selectedSizes: [],
  inStock: false,
  products: [],
  page: 1,
  size: 12,
  selectedSort: "NO SELCT",
};

export const categorySlice = createSlice({
  name: "categorySlice",
  initialState,
  reducers: {
    toggleFilter: (state) => {
      state.showFilter = !state.showFilter;
    },
    setSelectedBrands: (state, action: PayloadAction<string[]>) => {
      state.selectedBrands = action.payload;
    },
    setSelectedSizes: (state, action: PayloadAction<string[]>) => {
      state.selectedSizes = action.payload;
    },
    setInStock: (state, action: PayloadAction<boolean>) => {
      state.inStock = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
    setSelectedSort: (state, action: PayloadAction<string>) => {
      state.selectedSort = action.payload;
    },
    resetFilter: (state) => {
      state.selectedBrands = [];
      state.selectedSizes = [];
      state.inStock = false;
      state.page = 1;
      state.size = 20;
      state.selectedSort = "";
    },
  },
});

export const {
  toggleFilter,
  setSelectedBrands,
  setSelectedSizes,
  setInStock,
  setProducts,
  setPage,
  setSize,
  setSelectedSort,
  resetFilter,
} = categorySlice.actions;

export default categorySlice.reducer;
