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
        setCart: (state, action) => {
            state.items = action.payload
        },
        addItemToCart: (state, action) => {
            const item = action.payload
            const index = state.items.findIndex(cartItem => (cartItem.item.shoeId === item.item.shoeId && cartItem.size === item.size))
            if (index === -1) {
                state.items.push(item)
            } else {
                state.items[index].quantity += item.quantity
                state.items = [...state.items]
            }
            window.localStorage.setItem("cart", JSON.stringify(state.items))
        },
        removeItemFromCart: (state, action) => {
            const item = action.payload
            state.items = state.items.filter(cartItem => !(cartItem.item.shoeId == item.item.shoeId && cartItem.size == item.size))
            window.localStorage.setItem("cart", JSON.stringify(state.items))

        },
        updateQuantityInCart: (state, action) => {
        }
    }
});

export default cartSlice.reducer
export const {
    addItemToCart,
    removeItemFromCart,
    updateQuantityInCart,
    setCart
} = cartSlice.actions