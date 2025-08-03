// src/asyncThunk/userAsyncThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeAPICall, resetAPIHealth } from "../config/api";

// Helper function to handle auth errors
const handleAuthError = (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.clear();
    window.location.href = "/login";
    return true;
  }
  return false;
};

// Helper function to get token
const getStoredToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return token;
};

export const signupUser = createAsyncThunk(
  "user/signup",
  async ({ Username, Password, Email, Birthday }, { rejectWithValue }) => {
    try {
      const data = { Username, Password, Email, Birthday };
      const response = await makeAPICall("/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || "Registration failed"
        );
      }

      const signupUser = await response.json();
      return signupUser;
    } catch (error) {
      if (!navigator.onLine || error.message === "Failed to fetch") {
        return rejectWithValue(
          "Unable to connect to server. Please check your internet connection and try again."
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = { Username: username, Password: password };
      const response = await makeAPICall("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/edit",
  async ({ userData, updatedUserData, token }, { rejectWithValue }) => {
    try {
      const authToken = token || getStoredToken();
      if (!authToken) return rejectWithValue("No authentication token");

      const response = await makeAPICall(`/user/${userData.Username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        if (handleAuthError(response)) {
          return rejectWithValue("Session expired. Please log in again.");
        }

        // Better error handling
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        } catch (parseError) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      console.error("Edit user error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async ({ user, token }, { rejectWithValue }) => {
    try {
      const authToken = token || getStoredToken();
      if (!authToken) return rejectWithValue("No authentication token");

      const response = await makeAPICall(`/user/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (handleAuthError(response)) {
          return rejectWithValue("Session expired. Please log in again.");
        }
        throw new Error("Failed to delete the user.");
      }

      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavoriteMovieToUser = createAsyncThunk(
  "user/addFavoriteMovieToUser",
  async ({ userId, movieId }, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      if (!token) return rejectWithValue("No authentication token");

      const response = await makeAPICall("/user/addfavorite", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId, movieId }),
      });

      if (!response.ok) {
        if (handleAuthError(response)) {
          return rejectWithValue("Session expired. Please log in again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ userData, passwordData }, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      if (!token) return rejectWithValue("No authentication token");

      const response = await makeAPICall(
        `/user/${userData.Username}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordData),
        }
      );

      if (!response.ok) {
        if (handleAuthError(response)) {
          return rejectWithValue("Session expired. Please log in again.");
        }

        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to change password");
        } catch (parseError) {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      await response.json();
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      console.error("Change password error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavoriteMovie = createAsyncThunk(
  "user/removeFavoriteMovie",
  async ({ user, movieId }, { rejectWithValue }) => {
    try {
      const token = getStoredToken();
      if (!token) return rejectWithValue("No authentication token");

      const encodedMovieId = encodeURIComponent(movieId);
      const response = await makeAPICall(
        `/user/${user._id}/${encodedMovieId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (handleAuthError(response)) {
          return rejectWithValue("Session expired. Please log in again.");
        }

        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to remove from favorites"
          );
        } catch (parseError) {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Return updated user object
      const updatedUser = {
        ...user,
        FavoriteMovies: user.FavoriteMovies.filter(
          (movie) => movie !== movieId
        ),
      };
      return updatedUser;
    } catch (error) {
      console.error("Remove favorite error:", error);
      return rejectWithValue(error.message);
    }
  }
);
