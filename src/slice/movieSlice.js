import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");

export const getMovies = createAsyncThunk("movies/getMovies", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch("https://historymovieapi-production.up.railway.app/Movies", {
            headers: { Authorization: `Bearer ${storedToken}` },
        });

        const movieData = await response.json();
        if (movieData) {
            const historyMovieApi = movieData.map((data) => ({
                id: data._id,
                title: data.Title,
                description: data.Description,
                image: data.Image,
                director: data.Director,
                actor: data.Actors,
                genre: data.Genre,
                featured: data.Featured,
                ReleaseDate: data.ReleaseDate,
                Runtime: data.Runtime,
            }));
            return historyMovieApi;
        } else {
            return rejectWithValue("Network Problem. Please try again later.");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const movieSlice = createSlice({
    name: "movies",
    initialState: {
        movies: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.movies = action.payload;
            })
            .addCase(getMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default movieSlice.reducer;
