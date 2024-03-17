import { configureStore } from "@reduxjs/toolkit";
// import { userReducer, asyncUserReducer } from "../reducers/userReducer"; // Import your root reducer
import userReducer from "../slice/userSlice";
import movieReducer from "../slice/movieSlice";
// Create and configure the Redux store
const store = configureStore({
    reducer: {
        user: userReducer,
        movies: movieReducer,
    },
});

export default store;
