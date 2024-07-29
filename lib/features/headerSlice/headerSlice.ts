import {createSlice} from "@reduxjs/toolkit";

interface Header {
    showMenu: boolean;
    showLoginDialog: boolean;
    showSearchDialog: boolean;
}

const initialState: Header = {
    showMenu: false,
    showLoginDialog: false,
    showSearchDialog: false
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
            },
            showSearchDialog: (state) => {
                state.showSearchDialog = true
            },
            closeSearchDialog: (state) => {
                state.showSearchDialog = false
            }
        }
    }
)

export default headerSlice.reducer
export const {setShowMenu,closeLoginDialog,showSearchDialog,closeSearchDialog,showLoginDialog} = headerSlice.actions