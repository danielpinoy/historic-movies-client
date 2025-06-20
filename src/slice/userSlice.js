import {
  signupUser,
  loginUser,
  editUser,
  deleteUser,
  addFavoriteMovieToUser,
  removeFavoriteMovie,
  changePassword,
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
    clearStates: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        console.log(action.payload);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload);
        if (action.payload && action.payload.user !== false) {
          state.user = action.payload.user;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
          window.location.reload();
          // console.log(action.payload);
        }
        // Wrong username and password
        else if (action.payload && action.payload.user === false) {
          state.error = "Incorrect Username or Password";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = "Network Problem. Please try again later.";
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
      })

      // Add cases for changePassword async thunk
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          alert(action.payload.message);
        }
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearStates } = userSlice.actions;
export default userSlice.reducer;
