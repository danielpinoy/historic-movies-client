// src/slice/movieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeAPICall, resetAPIHealth } from "../config/api";

// Helper functions
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

      console.log("Fetching movies from API with automatic fallback...");

      const response = await makeAPICall("/Movies", {
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
          console.error("Full error details:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          });
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
      }

      const movieData = await response.json();

      if (movieData && Array.isArray(movieData)) {
        // Map all movie data with comprehensive image fallbacks
        const historyMovieApi = movieData.map((data) => ({
          id: data._id,
          title: data.title,
          description: data.description,

          // Comprehensive image handling with fallbacks
          // Primary image for movie cards and general use
          image: data.images?.poster || data.image,

          // Specific image types with smart fallbacks
          posterImage: data.images?.poster || data.image,
          heroImage: data.images?.backdrop || data.heroImage || data.image,
          thumbnailImage: data.images?.thumbnail || data.image,
          backdrop: data.images?.backdrop || data.heroImage || data.image, // For components expecting 'backdrop'
          originalImage: data.images?.original || data.image,

          // Keep the full images object for flexibility
          images: data.images || {
            thumbnail: data.image,
            poster: data.image,
            backdrop: data.heroImage || data.image,
            original: data.image,
          },

          director: data.director,
          actor: data.actors || data.actor, // Handle both field names
          genre: data.genre || [],
          featured: data.featured || false,
          releaseDate: data.releaseDate,
          runtime: data.runtime || 0,
          rating: data.rating || 0,
          voteCount: data.voteCount || 0,
          tmdbId: data.tmdbId,
          budget: data.budget || 0,
          revenue: data.revenue || 0,
          popularity: data.popularity || 0,
        }));

        console.log(
          `✅ Successfully loaded ${historyMovieApi.length} movies with fallback-ready images`
        );

        // Debug: Log first movie to verify fields and fallbacks
        if (historyMovieApi.length > 0) {
          const firstMovie = historyMovieApi[0];
          console.log("Sample movie with all image fields:", {
            title: firstMovie.title,
            image: firstMovie.image,
            heroImage: firstMovie.heroImage,
            backdrop: firstMovie.backdrop,
            hasCloudinary: firstMovie.image?.includes("cloudinary"),
            hasImages: !!firstMovie.images,
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
    apiStatus: null, // Track which API is being used
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
      state.apiStatus = null;
    },
    stopLoading: (state) => {
      state.loading = false;
      isRequestInProgress = false;
    },
    // New action to manually reset API health check
    resetAPIHealthCheck: (state) => {
      resetAPIHealth();
      state.apiStatus = null;
      console.log("🔄 API health check reset from Redux");
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
        state.apiStatus = "connected";
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load movies";
        state.apiStatus = "error";

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

export const {
  clearMovieError,
  clearMovies,
  stopLoading,
  resetAPIHealthCheck,
} = movieSlice.actions;
export default movieSlice.reducer;
