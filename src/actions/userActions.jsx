export const SIGN_UP = "SIGN_UP";
export const LOG_OUT = "LOG_OUT";
export const DELETE_USER = "DELETE_USER";
export const UNFAVORITE_MOVIE = "UNFAVORITE_MOVIE";
const storedToken = localStorage.getItem("token");
// LOGIN
export const LOGIN_REQUEST = "LOGIN_REQUEST",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAILURE = "LOGIN_FAILURE";

// ADD FAVORITE_MOVIE
export const ADD_FAVORITE_MOVIE_REQUEST = "ADD_FAVORITE_MOVIE_REQUEST",
    ADD_FAVORITE_MOVIE_SUCCESS = "ADD_FAVORITE_MOVIE_SUCCESS",
    ADD_FAVORITE_MOVIE_FAILURE = "ADD_FAVORITE_MOVIE_FAILURE";

//  DELETE FAVORITE_MOVIE
export const DELETE_FAVORITE_MOVIE_REQUEST = "DELETE_FAVORITE_MOVIE_REQUEST",
    DELETE_FAVORITE_MOVIE_SUCCESS = "DELETE_FAVORITE_MOVIE_SUCCESS",
    DELETE_FAVORITE_MOVIE_FAILURE = "DELETE_FAVORITE_MOVIE_FAILURE";

// EDIT USER

export const EDIT_USER_REQUEST = "EDIT_USER_REQUEST",
    EDIT_USER_SUCCESS = "EDIT_USER_SUCCESS",
    EDIT_USER_FAILURE = "EDIT_USER_FAILURE";

// action creator

// SIGNUP
export const signup = (Username, Password, Email, Birthday) => async (dispatch) => {
    try {
        const data = {
            Username,
            Password,
            Email,
            Birthday,
        };

        const response = await fetch("https://history-movie-api.onrender.com/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            // Handle non-successful response (e.g., server error)
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const signupUser = await response.json();

        if (signupUser) {
            dispatch({ type: SIGN_UP, user: signupUser });
            alert("Signup successful");
        } else {
            alert("Signup failed");
        }
    } catch (error) {
        console.error("Error during signup:", error);
        alert("Signup failed. Please try again later.");
    }
};

// LOGIN
export const login = (username, password) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    const data = {
        Username: username,
        Password: password,
    };

    try {
        const response = await fetch("https://history-movie-api.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const userData = await response.json();

        if (userData.user) {
            dispatch({ type: LOGIN_SUCCESS, user: userData.data });
            localStorage.setItem("user", JSON.stringify(userData.user));
            localStorage.setItem("token", userData.token);
            window.location.reload();
        } else {
            dispatch({ type: LOGIN_FAILURE, user: "Wrong Password or Username" });
        }
    } catch (error) {
        console.error("Error adding movie to favorites:", error);

        dispatch({ type: LOGIN_FAILURE, user: "Network Problem. Please try again later." });
    }
};

// LOGOUT
export const logout = () => (dispatch) => {
    localStorage.clear();
    dispatch({ type: LOG_OUT });
    window.location.reload();
};

// EDIT USER
export const editUser = (userData, updatedUserData, token) => async (dispatch) => {
    dispatch({ type: EDIT_USER_REQUEST, user: userData });

    try {
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

        dispatch({ type: EDIT_USER_SUCCESS, user: updatedUser });
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // window.location.reload();
    } catch (error) {
        console.error("Error updating user:", error);
        dispatch({ type: EDIT_USER_FAILURE, user: "Network Problem. Please try again later." });
    }
};

// DELETE_USER
export const deleteUser = (user, token) => async (dispatch) => {
    try {
        const response = await fetch(`https://history-movie-api.onrender.com/user/${user._id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            localStorage.clear();
            dispatch({ type: DELETE_USER });
            window.location.reload();
        } else {
            console.error("Failed to delete the user.");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

// ADD_FAVORITE_MOVIE
export const addFavoriteMovieToUser = (userId, movieId) => async (dispatch) => {
    dispatch({ type: ADD_FAVORITE_MOVIE_REQUEST });
    try {
        const response = await fetch("https://history-movie-api.onrender.com/user/addfavorite", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId, movieId }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const updatedUser = await response.json();

        dispatch({ type: ADD_FAVORITE_MOVIE_SUCCESS, user: updatedUser });
        localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
        console.error("Error adding movie to favorites:", error);
        dispatch({
            type: ADD_FAVORITE_MOVIE_FAILURE,
            user: "Network Problem. Please try again later.",
        });
    }
};

// DELETE_FAVORITE_MOVIE
export const unFavoriteMovie = (user, movieId) => async (dispatch) => {
    dispatch({ type: DELETE_FAVORITE_MOVIE_REQUEST, user: user });

    console.log(movieId);
    try {
        const encodedMovieId = encodeURIComponent(movieId);
        console.log(encodedMovieId);
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

            dispatch({ type: DELETE_FAVORITE_MOVIE_SUCCESS, user: updatedUser });
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
            console.error("Failed to delete the FavoriteMovie from user");
        }
    } catch (error) {
        dispatch({
            type: DELETE_FAVORITE_MOVIE_FAILURE,
            user: "Network Problem. Please try again later.",
        });
        console.error("Error removing movie to favorites:", error);
    }
};
