import { BagItem } from "@/interfaces/BagItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BagSlice {
  bag: BagItem[];
  showBag: boolean;
  couponCode: string | null;
  couponDiscount: number;
  promotionId: string | null;
  promotionDiscount: number;
}

const initialState: BagSlice = {
  bag: [],
  showBag: false,
  couponCode: null,
  couponDiscount: 0,
  promotionId: null,
  promotionDiscount: 0,
};

const bagSlice = createSlice({
  name: "bag",
  initialState,
  reducers: {
    initializeBag(state) {
      const bag = window.localStorage.getItem("NEVERBEBag");
      const couponCode = window.localStorage.getItem("NEVERBECouponCode");
      const couponDiscount = window.localStorage.getItem("NEVERBEDiscount");

      if (bag) {
        state.bag = JSON.parse(bag);
      } else {
        state.bag = [];
        window.localStorage.setItem("NEVERBEBag", JSON.stringify([]));
      }

      if (couponCode) state.couponCode = couponCode;
      if (couponDiscount) state.couponDiscount = Number(couponDiscount);
      // Note: promotions are session-only, not persisted
    },
    applyCoupon(state, action) {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
      window.localStorage.setItem("NEVERBECouponCode", action.payload.code);
      window.localStorage.setItem(
        "NEVERBEDiscount",
        action.payload.discount.toString()
      );
    },
    removeCoupon(state) {
      state.couponCode = null;
      state.couponDiscount = 0;
      window.localStorage.removeItem("NEVERBECouponCode");
      window.localStorage.removeItem("NEVERBEDiscount");
    },
    applyPromotion(
      state,
      action: PayloadAction<{ id: string; discount: number }>
    ) {
      state.promotionId = action.payload.id;
      state.promotionDiscount = action.payload.discount;
    },
    removePromotion(state) {
      state.promotionId = null;
      state.promotionDiscount = 0;
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
    addMultipleToBag(state, action: PayloadAction<BagItem[]>) {
      const newItems = action.payload;
      let currentBag: BagItem[] = [...state.bag];

      newItems.forEach((newItem) => {
        const existingIndex = currentBag.findIndex(
          (item) =>
            item.itemId === newItem.itemId &&
            item.variantId === newItem.variantId &&
            item.size === newItem.size
        );

        if (existingIndex > -1) {
          currentBag[existingIndex].quantity += newItem.quantity;
          currentBag[existingIndex].discount += newItem.discount;
        } else {
          currentBag.push(newItem);
        }
      });

      state.bag = currentBag;
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
    // Remove all items from a specific combo
    removeComboFromBag(state, action: PayloadAction<string>) {
      const comboId = action.payload;
      state.bag = state.bag.filter((item) => item.comboId !== comboId);
      window.localStorage.setItem("NEVERBEBag", JSON.stringify(state.bag));
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
  applyCoupon,
  removeCoupon,
  applyPromotion,
  removePromotion,
  addMultipleToBag,
  removeComboFromBag,
} = bagSlice.actions;
export default bagSlice.reducer;
