"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  productId: string;
  variantId: string;
  name: string;
  thumbnail: string;
  price: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
}

// Load from localStorage
const loadWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("neverbe_wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Persist to localStorage
const saveWishlist = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("neverbe_wishlist", JSON.stringify(items));
  } catch {
    console.error("Failed to save wishlist");
  }
};

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    hydrateWishlist: (state) => {
      state.items = loadWishlist();
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );
      if (!exists) {
        state.items.push(action.payload);
        saveWishlist(state.items);
      }
    },
    removeFromWishlist: (
      state,
      action: PayloadAction<{ productId: string; variantId: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.variantId === action.payload.variantId
          )
      );
      saveWishlist(state.items);
    },
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const index = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlist([]);
    },
  },
});

export const {
  hydrateWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
