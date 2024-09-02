import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {shoesCollectionRef} from "@/firebase/Firebase";
import {getDocs, query, updateDoc, where} from "firebase/firestore";

interface CartSlice {
    isLoading: boolean | null;
    items: CartItem[];
}

const initialState: CartSlice = {
    isLoading: null,
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
        }
    },

    extraReducers: (builder) => {
        builder.addCase(updateStocks.pending, (state) => {
            state.isLoading = true
        }).addCase(updateStocks.fulfilled, (state) => {
            state.isLoading = false
        }).addCase(updateStocks.rejected, (state) => {
            state.isLoading = false
        })
    }
});
export const updateStocks = createAsyncThunk("cartSlice/updateStock", async ({shoeId, size, qty}: {
    shoeId: string,
    size: number,
    qty: number
}, thunkAPI) => {
    try {
        const shoeQuery = query(shoesCollectionRef, where("shoeId", "==", shoeId));
        const doc = await getDocs(shoeQuery);
        const data = doc.docs.map(doc => doc.data());
        const shoe = data[0];
        if (shoe.stocks[size] < qty) return thunkAPI.rejectWithValue("Not enough stock")
        shoe.stocks[size] -= qty;
        await updateDoc(doc.docs[0].ref, {stocks: shoe.stocks});
    } catch (e) {
        return thunkAPI.rejectWithValue(e)
    }
});

export default cartSlice.reducer
export const {
    addItemToCart,
    removeItemFromCart,
    setCart
} = cartSlice.actions