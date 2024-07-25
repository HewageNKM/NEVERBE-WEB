import {createSlice} from "@reduxjs/toolkit";

interface Header {
    showMenu: boolean;
}

const initialState: Header = {
    showMenu: false
}

const headerSlice = createSlice(
    {
        name: "promotionsSlice",
        initialState,
        reducers: {
            setShowMenu: (state, action) => {
                state.showMenu = action.payload
            }
        }
    }
)

export default headerSlice.reducer
export const {setShowMenu} = headerSlice.actions