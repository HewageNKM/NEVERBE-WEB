import { Item } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

interface BrandSlice {
  products: Item[];
  showFilter: boolean;
  selectedSort: string;
  selectedCategories: string[];
  inStock: boolean;
  page: number;
  size: number;
}

const initialState: BrandSlice = {
  page: 1,
  size: 10,
  products: [],
  inStock: false,
  showFilter: false,
  selectedCategories: [],
  selectedSort: "",
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
      if (state.selectedSort != "") {
        if (state.selectedSort === "lh") {
          state.products = state.products.sort(
            (a, b) => a.sellingPrice - b.sellingPrice
          );
        } else if (state.selectedSort === "hl") {
          state.products = state.products.sort(
            (a, b) => b.sellingPrice - a.sellingPrice
          );
        } else if (state.selectedSort == "") {
          state.products = action.payload;
        } else {
          state.products = action.payload;
        }
      } else {
        state.products = action.payload;
      }
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    resetFilter: (state) => {
      state.selectedSort = "";
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
} = brandSlice.actions;

export default brandSlice.reducer;
