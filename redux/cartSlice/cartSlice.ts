import {CartItem} from "@/interfaces";
import {createSlice} from "@reduxjs/toolkit";

interface CartSlice {
    cart: CartItem[];
    showCart: boolean;
}

const initialState: CartSlice = {
    cart: [],
    showCart: false
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        initializeCart(state) {
            const cart = window.localStorage.getItem('NEVERBECart');
            if (cart) {
                state.cart = JSON.parse(cart);
            } else {
                state.cart = [];
                window.localStorage.setItem('NEVERBECart', JSON.stringify([]));
            }
        },
        pushToCart(state, action) {
            let itemCart:any = window.localStorage.getItem('NEVERBECart');
            if (itemCart) {
                itemCart = JSON.parse(itemCart) as CartItem[];
                let doesExist = false;
                state.cart = itemCart.map((item: CartItem) => {
                    if (item.itemId === action.payload.itemId && item.variantId === action.payload.variantId && item.size === action.payload.size) {
                        item.quantity += action.payload.quantity;
                        item.discount += action.payload.discount;
                        doesExist = true;
                        return item;
                    }
                    return item;
                });
                if (!doesExist) {
                    state.cart.push(action.payload);
                }
            }
            window.localStorage.setItem('NEVERBECart', JSON.stringify(state.cart));
        },
        removeFromCart(state, action) {
            const items = window.localStorage.getItem('NEVERBECart');
            state.cart = JSON.parse(<string>items).filter((item: CartItem) => item.itemId !== action.payload.itemId || item.variantId !== action.payload.variantId || item.size !== action.payload.size);
            window.localStorage.setItem('NEVERBECart', JSON.stringify(state.cart));
        },
        updateQuantity(state, action) {
            const {itemId, quantity} = action.payload;
            const item = state.cart.find(item => item.itemId === itemId);
            if (item) {
                item.quantity = quantity;
            }
            window.localStorage.setItem('NEVERBECart', JSON.stringify(state.cart));
        },
        showCart(state) {
            state.showCart = true;
        },
        hideCart(state) {
            state.showCart = false
        },
        clearCart(state) {
            state.cart = [];
            window.localStorage.setItem('NEVERBECart', JSON.stringify([]));
        }
    }
});

export const {initializeCart, pushToCart, removeFromCart, clearCart,updateQuantity, showCart, hideCart} = cartSlice.actions;
export default cartSlice.reducer;