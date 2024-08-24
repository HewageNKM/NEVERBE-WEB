import {createSlice} from "@reduxjs/toolkit";

interface CartSlice{
    items: CartItem[];
}

const initialState: CartSlice = {
    items: []
}

const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            state.items.push(action.payload)
        },
        removeItemFromCart: (state, action) => {
            state.items = state.items.filter(item => item.item.shoeId !== action.payload)
        },
        updateQuantityInCart: (state, action) => {
            const index = state.items.findIndex(item => item.item.shoeId === action.payload.shoeId)
            state.items[index].quantity = action.payload.quantity;
            if (state.items[index].quantity <= 0) {
                state.items = state.items.filter(item => item.item.shoeId !== action.payload.shoeId)
            }
        }
    }
});

export default cartSlice.reducer
export const {
    addItemToCart,
    removeItemFromCart,
    updateQuantityInCart
} = cartSlice.actions