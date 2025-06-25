import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
const API_URL =
  "https://xo4xjqevs42mbp46utxi3dua3y0lwywt.lambda-url.eu-north-1.on.aws";

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/Movies`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      const movieData = await response.json();
      if (movieData) {
        const historyMovieApi = movieData.map((data) => ({
          id: data._id,
          title: data.title,
          description: data.description,
          image: data.image,
          director: data.director,
          actor: data.actors,
          genre: data.genre,
          featured: data.featured,
          releaseDate: data.releaseDate,
          runtime: data.runtime,
          // New fields you can use:
          rating: data.rating, // NEW: TMDB rating (number)
          voteCount: data.voteCount, // NEW: How many people voted
          tmdbId: data.tmdbId, // NEW: TMDB ID
          budget: data.budget, // NEW: Movie budget
          revenue: data.revenue, // NEW: Box office revenue
        }));
        return historyMovieApi;
      } else {
        return rejectWithValue("Network Problem. Please try again later.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
