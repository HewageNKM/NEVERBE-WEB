import {createSlice} from "@reduxjs/toolkit";

interface HeaderSlice {
    showMenu: boolean;
}

const initialState: HeaderSlice = {
    showMenu: false
};

export const headerSlice = createSlice({
    name: 'headerSlice',
    initialState,
    reducers: {
       toggleMenu:(state, action) => {
              state.showMenu = action.payload;
       }
    },
});

export const {toggleMenu} = headerSlice.actions;
export default headerSlice.reducer;