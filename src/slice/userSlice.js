import {
    signupUser,
    loginUser,
    editUser,
    deleteUser,
    addFavoriteMovieToUser,
    removeFavoriteMovie,
} from "../asyncThunk/userAsyncThunks";
import { createSlice } from "@reduxjs/toolkit";
const storedUser = JSON.parse(localStorage.getItem("user"));

const userSlice = createSlice({
    name: "user",
    initialState: { user: storedUser || null, loading: false, error: null },
    reducers: {
        logout: (state) => {
            localStorage.clear();
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.fulfilled, (state, action) => {
                state.user = action.payload;
                alert("Signup successful");
            })
            .addCase(signupUser.rejected, (state, action) => {
                alert("Signup failed");
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
                if (action.payload && action.payload.user !== false) {
                    state.user = action.payload.user;
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                    localStorage.setItem("token", action.payload.token);
                    window.location.reload();
                }
                // Wrong username and password
                else if (action.payload && action.payload.user === false) {
                    state.error = "Incorrect Username or Password";
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;

                state.error = "Network Problems";
                // if (action.payload === undefined) {
                //     state.error = "Network Error";
                // } else {
                //     // Check if the user is false, indicating an incorrect password
                //     state.error =
                //         action.payload.user === false ? action.payload.message : "Unknown Error";
                // }
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = "Network Problem. Please try again later.";
            })
            .addCase(deleteUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(addFavoriteMovieToUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFavoriteMovieToUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(addFavoriteMovieToUser.rejected, (state, action) => {
                state.loading = false;
                state.error = "Network Problem. Please try again later.";
            })
            .addCase(removeFavoriteMovie.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFavoriteMovie.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                console.log(action.payload);
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(removeFavoriteMovie.rejected, (state, action) => {
                state.loading = false;
                state.error = "Network Problem. Please try again later.";
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
