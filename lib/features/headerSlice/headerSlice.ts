import {createSlice} from "@reduxjs/toolkit";

interface Header {
    showNav: boolean;
    showLoginDialog: boolean;
    showSearchDialog: boolean;
}

const initialState: Header = {
    showNav: false,
    showLoginDialog: false,
    showSearchDialog: false
}

const headerSlice = createSlice(
    {
        name: "promotionsSlice",
        initialState,
        reducers: {
            setShowMenu: (state, action) => {
                state.showNav = action.payload
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