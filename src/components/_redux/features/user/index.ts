import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },

        logout: (state) => {
            state.user = {};
        }
    }
})

export const { getUser, logout } = userSlice.actions;

export default userSlice.reducer;