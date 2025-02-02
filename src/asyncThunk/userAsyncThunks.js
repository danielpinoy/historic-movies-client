import { createAsyncThunk } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));

const API_URL = "https://history-movie-api.vercel.app/";
// Async thunks
export const signupUser = createAsyncThunk(
    "user/signup",
    async ({ Username, Password, Email, Birthday }, { rejectWithValue }) => {
        try {
            const data = { Username, Password, Email, Birthday };
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const signupUser = await response.json();
            return signupUser;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "user/login",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const data = { Username: username, Password: password };
            const response = await fetch(`${API_URL}/login`, {
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
            const response = await fetch(`${API_URL}/user/${userData.Username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
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

export const deleteUser = createAsyncThunk(
    "user/delete",
    async ({ user, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/user/${user._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete the user.");
            }

            localStorage.clear();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addFavoriteMovieToUser = createAsyncThunk(
    "user/addFavoriteMovieToUser",
    async ({ userId, movieId }, { rejectWithValue }) => {
        try {
            console.log(userId + " " + movieId);

            const response = await fetch(`${API_URL}/user/addfavorite`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId, movieId }),
            });

            if (!response.ok) {
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
            const response = await fetch(`${API_URL}/user/${userData.Username}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(passwordData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            await response.json(); // Consume the response body
            return { success: true, message: "Password changed successfully" };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFavoriteMovie = createAsyncThunk(
    "user/removeFavoriteMovie",
    async ({ user, movieId }, { rejectWithValue }) => {
        try {
            const encodedMovieId = encodeURIComponent(movieId);
            const response = await fetch(`${API_URL}/user/${user._id}/${encodedMovieId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const updatedUser = {
                    ...user,
                    FavoriteMovies: user.FavoriteMovies.filter((movie) => movie !== movieId),
                };
                return updatedUser;
            } else {
                const updatedUser = storedUser;
                return updatedUser;
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
