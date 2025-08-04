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
  initialState: {
    user: storedUser || null,
    loading: false,
    error: null,
    isAuthenticated: !!storedUser,
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      window.location.href = "/login";
    },
    clearStates: (state) => {
      state.error = null;
      state.success = null;
    },
    forceLogout: (state) => {
      localStorage.clear();
      state.user = null;
      state.isAuthenticated = false;
      state.error = "Session expired. Please log in again.";
      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
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
        if (action.payload && action.payload.user !== false) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
          window.location.reload();
        } else if (action.payload && action.payload.user === false) {
          state.error = "Incorrect Username or Password";
          state.isAuthenticated = false;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
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
      //  Force logout on auth errors in ALL async actions
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        // Check for auth error
        if (action.payload?.includes("Session expired")) {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.clear();
          window.location.href = "/login";
        } else {
          state.error = "Network Problem. Please try again later.";
        }
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        if (action.payload?.includes("Session expired")) {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.clear();
          window.location.href = "/login";
        } else {
          state.error = "Network Problem. Please try again later.";
        }
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
        if (action.payload?.includes("Session expired")) {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.clear();
          window.location.href = "/login";
        } else {
          state.error = "Network Problem. Please try again later.";
        }
      })
      .addCase(removeFavoriteMovie.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(removeFavoriteMovie.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.includes("Session expired")) {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.clear();
          window.location.href = "/login";
        } else {
          state.error = "Network Problem. Please try again later.";
        }
      })
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
      });
  },
});

export const { logout, clearStates, forceLogout } = userSlice.actions;
export default userSlice.reducer;
