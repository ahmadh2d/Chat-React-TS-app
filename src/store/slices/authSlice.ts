import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthSliceState } from "../../types/AuthSliceState";
import { CurrentUser } from "../../types/CurrentUser";
import { fetchUserData } from "../thunks/fetchUserData";

const initialState: AuthSliceState = {
    isLoading: true,
    currentUser: null,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(
            fetchUserData.fulfilled,
            (state, action: PayloadAction<CurrentUser | null>) => {
                state.currentUser = action.payload;
                state.isLoading = false;
            }
        );
        builder.addCase(
            fetchUserData.rejected,
            (state, action: PayloadAction<unknown>) => {
                state.error = action.payload as Error;
                state.isLoading = false;
                state.currentUser = null;
            }
        );
    },
});

export default authSlice.reducer;
