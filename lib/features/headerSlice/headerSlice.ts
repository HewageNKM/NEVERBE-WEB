import {createSlice} from "@reduxjs/toolkit";

interface Header {
    showMenu: boolean;
    showLoginDialog: boolean;
}

const initialState: Header = {
    showMenu: false,
    showLoginDialog: false
}

const headerSlice = createSlice(
    {
        name: "promotionsSlice",
        initialState,
        reducers: {
            setShowMenu: (state, action) => {
                state.showMenu = action.payload
            },
            showLoginDialog: (state) => {
                state.showLoginDialog = true
            },
            closeLoginDialog: (state) => {
                state.showLoginDialog = false
            }
        }
    }
)

export default headerSlice.reducer
export const {setShowMenu,closeLoginDialog,showLoginDialog} = headerSlice.actions