import { BagItem } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

interface BagSlice {
  bag: BagItem[];
  showBag: boolean;
}

const initialState: BagSlice = {
  bag: [],
  showBag: false,
};

const bagSlice = createSlice({
  name: "bag",
  initialState,
  reducers: {
    initializeBag(state) {
      const bag = window.localStorage.getItem("NEVERBEBag");
      if (bag) {
        state.bag = JSON.parse(bag);
      } else {
        state.bag = [];
        window.localStorage.setItem("NEVERBEBag", JSON.stringify([]));
      }
    },
    addToBag(state, action) {
      let itemBag: any = window.localStorage.getItem("NEVERBEBag");
      if (itemBag) {
        itemBag = JSON.parse(itemBag) as BagItem[];
        let doesExist = false;
        state.bag = itemBag.map((item: BagItem) => {
          if (
            item.itemId === action.payload.itemId &&
            item.variantId === action.payload.variantId &&
            item.size === action.payload.size
          ) {
            item.quantity += action.payload.quantity;
            item.discount += action.payload.discount;
            doesExist = true;
            return item;
          }
          return item;
        });
        if (!doesExist) {
          state.bag.push(action.payload);
        }
      }
      window.localStorage.setItem("NEVERBEBag", JSON.stringify(state.bag));
    },
    removeFromBag(state, action) {
      const items = window.localStorage.getItem("NEVERBEBag");
      state.bag = JSON.parse(<string>items).filter(
        (item: BagItem) =>
          item.itemId !== action.payload.itemId ||
          item.variantId !== action.payload.variantId ||
          item.size !== action.payload.size
      );
      window.localStorage.setItem("NEVERBEBag", JSON.stringify(state.bag));
    },
    updateQuantity(state, action) {
      const { itemId, quantity } = action.payload;
      const item = state.bag.find((item) => item.itemId === itemId);
      if (item) {
        item.quantity = quantity;
      }
      window.localStorage.setItem("NEVERBEBag", JSON.stringify(state.bag));
    },
    showBag(state) {
      state.showBag = true;
    },
    hideBag(state) {
      state.showBag = false;
    },
    clearBag(state) {
      state.bag = [];
      window.localStorage.setItem("NEVERBEBag", JSON.stringify([]));
    },
  },
});

export const {
  initializeBag,
  addToBag,
  removeFromBag,
  clearBag,
  updateQuantity,
  showBag,
  hideBag,
} = bagSlice.actions;
export default bagSlice.reducer;
