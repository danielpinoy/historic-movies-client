import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  "https://xo4xjqevs42mbp46utxi3dua3y0lwywt.lambda-url.eu-north-1.on.aws";

// Helper functions (keep your existing auth helpers)
const handleAuthError = (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.clear();
    window.location.href = "/login";
    return true;
  }
  return false;
};

const getValidToken = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    localStorage.clear();
    window.location.href = "/login";
    return null;
  }
  return token;
};

let isRequestInProgress = false;

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async (_, { rejectWithValue, getState }) => {
    if (isRequestInProgress) {
      return rejectWithValue("Request already in progress");
    }

    const currentMovies = getState().movies.movies;
    if (currentMovies && currentMovies.length > 0) {
      console.log("Movies already loaded, skipping request");
      return currentMovies;
    }

    try {
      isRequestInProgress = true;

      const token = getValidToken();
      if (!token) {
        return rejectWithValue(
          "Authentication required. Redirecting to login..."
        );
      }

      console.log("Fetching movies from API...");

      const response = await fetch(`${API_URL}/Movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
          return rejectWithValue("Session expired. Redirecting to login...");
        }

        if (response.status === 0 || response.type === "opaque") {
          throw new Error(
            "CORS error: Cannot connect to server. Please try again later."
          );
        }

        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        } catch (parseError) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }

      const movieData = await response.json();

      if (movieData && Array.isArray(movieData)) {
        // FIXED: Map all the new optimized image fields
        const historyMovieApi = movieData.map((data) => ({
          id: data._id,
          title: data.title,
          description: data.description,
          image: data.image, // Pre-optimized main image (300x450)
          heroImage: data.heroImage, // Pre-optimized hero image (600x800) - ADD THIS!
          director: data.director,
          actor: data.actors,
          genre: data.genre,
          featured: data.featured,
          releaseDate: data.releaseDate,
          runtime: data.runtime,
          rating: data.rating,
          voteCount: data.voteCount,
          tmdbId: data.tmdbId,
          budget: data.budget,
          revenue: data.revenue,
        }));

        console.log(
          `Successfully loaded ${historyMovieApi.length} movies with optimized images`
        );

        // Debug: Log first movie to verify fields
        if (historyMovieApi.length > 0) {
          console.log("Sample movie with images:", {
            title: historyMovieApi[0].title,
            image: historyMovieApi[0].image,
            heroImage: historyMovieApi[0].heroImage,
            hasCloudinary: historyMovieApi[0].image?.includes("cloudinary"),
          });
        }

        return historyMovieApi;
      } else {
        throw new Error("Invalid movie data received from server");
      }
    } catch (error) {
      console.error("Movie fetch error:", error);

      if (!navigator.onLine) {
        return rejectWithValue(
          "No internet connection. Please check your network and try again."
        );
      }

      if (
        error.message === "Failed to fetch" ||
        error.message.includes("CORS")
      ) {
        return rejectWithValue(
          "Unable to connect to server. Please check your connection and try again later."
        );
      }

      return rejectWithValue(error.message);
    } finally {
      isRequestInProgress = false;
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    error: null,
    lastFetchTime: null,
  },
  reducers: {
    clearMovieError: (state) => {
      state.error = null;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.loading = false;
      state.error = null;
      state.lastFetchTime = null;
    },
    stopLoading: (state) => {
      state.loading = false;
      isRequestInProgress = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        if (state.movies.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
        state.error = null;
        state.lastFetchTime = Date.now();
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load movies";

        if (
          action.payload?.includes("Session expired") ||
          action.payload?.includes("Authentication required")
        ) {
          state.movies = [];
        }

        if (
          action.payload?.includes("CORS") ||
          action.payload?.includes("connect to server")
        ) {
          console.log("CORS error detected, stopping auto-retry");
        }
      });
  },
});

export const { clearMovieError, clearMovies, stopLoading } = movieSlice.actions;
export default movieSlice.reducer;
