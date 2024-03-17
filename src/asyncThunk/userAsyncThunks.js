import { createAsyncThunk } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const storedUser = JSON.parse(localStorage.getItem("user"));

// Async thunks
export const signupUser = createAsyncThunk(
    "user/signup",
    async ({ Username, Password, Email, Birthday }) => {
        const data = { Username, Password, Email, Birthday };
        console.log(data, "data");
        const response = await fetch("https://history-movie-api.onrender.com/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const signupUser = await response.json();
        console.log(signupUser);
        return signupUser;
    }
);

export const loginUser = createAsyncThunk("user/login", async ({ username, password }) => {
    const data = { Username: username, Password: password };
    const response = await fetch("https://history-movie-api.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const userData = await response.json();

    // If the server returns an object with "user" set to false, throw an error with the message
    console.log(userData);
    // if (!userData.user) {
    //     throw new Error(userData.message || "Login failed");
    // }
    return userData;
});

export const editUser = createAsyncThunk(
    "user/edit",
    async ({ userData, updatedUserData, token }) => {
        const response = await fetch(
            `https://history-movie-api.onrender.com/user/${userData.Username}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUserData),
            }
        );

        const updatedUser = await response.json();
        return updatedUser;
    }
);

export const deleteUser = createAsyncThunk("user/delete", async ({ user, token }) => {
    const response = await fetch(`https://history-movie-api.onrender.com/user/${user._id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        localStorage.clear();
    } else {
        throw new Error("Failed to delete the user.");
    }
});

export const addFavoriteMovieToUser = createAsyncThunk(
    "user/addFavoriteMovieToUser",
    async ({ userId, movieId }) => {
        console.log(userId + " " + movieId);

        const response = await fetch("https://history-movie-api.onrender.com/user/addfavorite", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId, movieId }),
        });
        const updatedUser = await response.json();
        return updatedUser;
    }
);

export const removeFavoriteMovie = createAsyncThunk(
    "user/removeFavoriteMovie",
    async ({ user, movieId }) => {
        const encodedMovieId = encodeURIComponent(movieId);
        const response = await fetch(
            `https://history-movie-api.onrender.com/user/${user._id}/${encodedMovieId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

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
    }
);
