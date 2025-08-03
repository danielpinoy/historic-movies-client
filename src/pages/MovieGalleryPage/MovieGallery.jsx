import React, { useState, useMemo } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Search, Film, Filter, ChevronDown, ChevronUp } from "lucide-react";
import "./MovieGallery.css";

const MovieGallery = ({ movies, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("rating");
  const [displayedCount, setDisplayedCount] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  console.log("MovieGallery received:", {
    moviesLength: movies?.length,
    loading,
    error,
  });
  const getYear = (dateString) => {
    if (!dateString) return 0;
    try {
      return new Date(dateString).getFullYear() || 0;
    } catch {
      return 0;
    }
  };

  const getYearRange = (year) => {
    if (year >= 2020) return "2020s";
    if (year >= 2010) return "2010s";
    if (year >= 2000) return "2000s";
    if (year >= 1990) return "1990s";
    if (year >= 1980) return "1980s";
    return "older";
  };

  // Get all unique genres for filter dropdown
  const allGenres = useMemo(() => {
    const genres = new Set();
    movies.forEach((movie) => {
      movie.genre.forEach((g) => genres.add(g));
    });
    return ["All", ...Array.from(genres)].sort();
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let filtered = movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        genreFilter === "All" || movie.genre.includes(genreFilter);
      const matchesYear =
        yearFilter === "All" ||
        getYearRange(getYear(movie.releaseDate)) === yearFilter;

      return matchesSearch && matchesGenre && matchesYear;
    });

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortFilter) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "year":
          return getYear(b.releaseDate) - getYear(a.releaseDate);
        case "title":
          return a.title.localeCompare(b.title);
        case "popularity":
          return (b.voteCount || 0) - (a.voteCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [movies, searchTerm, genreFilter, yearFilter, sortFilter]);

  const quickSearch = (genre) => {
    setGenreFilter(genre);
    setDisplayedCount(12);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setGenreFilter("All");
    setYearFilter("All");
    setSortFilter("rating");
    setDisplayedCount(12);
  };

  const loadMore = () => {
    setDisplayedCount((prev) => prev + 12);
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-content">
          <Film size={48} className="loading-icon" />
          <h2>Loading Movies...</h2>
          <p>Preparing your cinematic experience</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-error">
        <div className="error-content">
          <Film size={48} className="error-icon" />
          <h2>Error Loading Movies</h2>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  const moviesToShow = filteredMovies.slice(0, displayedCount);

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <h1 className="gallery-title">Movie Collection</h1>
        <p className="gallery-subtitle">
          Discover and explore our curated selection of historical movies
        </p>
      </div>

      {/* Search and Filters */}
      <div
        className="glass-dark-strong rounded-3 p-4 sticky-top"
        style={{ top: "1rem", zIndex: 100 }}
      >
        <div className="search-bar-container">
          <div className="search-bar">
            <InputGroup size="lg">
              <InputGroup.Text className="search-icon">
                <Search size={20} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search for movies, actors, directors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </div>

          <button
            className="filters-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            <Filter size={20} />
            <span>Filters</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div
          className={`filters-section ${
            showFilters ? "expanded" : "collapsed"
          }`}
        >
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Genre:</label>
              <Form.Select
                className="filter-select"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Year:</label>
              <Form.Select
                className="filter-select"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="All">All Years</option>
                <option value="2020s">2020s</option>
                <option value="2010s">2010s</option>
                <option value="2000s">2000s</option>
                <option value="1990s">1990s</option>
                <option value="1980s">1980s</option>
              </Form.Select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <Form.Select
                className="filter-select"
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
              >
                <option value="rating">Highest Rated</option>
                <option value="year">Newest First</option>
                <option value="title">A-Z</option>
                <option value="popularity">Most Popular</option>
              </Form.Select>
            </div>

            <div className="results-info">
              {filteredMovies.length === 0
                ? "No movies found"
                : `Showing ${Math.min(
                    displayedCount,
                    filteredMovies.length
                  )} of ${filteredMovies.length} movies`}
            </div>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎬</div>
          <h3 className="empty-state-title">No movies found</h3>
          <p className="empty-state-description">
            We couldn't find any movies matching your search criteria. Try
            adjusting your filters or search terms.
          </p>
          <div className="empty-state-suggestions">
            <div
              className="suggestion-pill"
              onClick={() => quickSearch("Action")}
            >
              Action
            </div>
            <div
              className="suggestion-pill"
              onClick={() => quickSearch("Drama")}
            >
              Drama
            </div>
            <div
              className="suggestion-pill"
              onClick={() => quickSearch("History")}
            >
              History
            </div>
            <div className="suggestion-pill" onClick={() => quickSearch("War")}>
              War
            </div>
          </div>
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {moviesToShow.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {displayedCount < filteredMovies.length && (
            <div className="load-more-section">
              <button className="load-more-btn" onClick={loadMore}>
                Load More Movies
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Movie Card Component
const MovieCard = ({ movie }) => {
  const getYear = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).getFullYear() || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-poster">
          <img src={movie.image} alt={movie.title} className="movie-image" />
          <div className="movie-rating">
            {movie.rating ? movie.rating.toFixed(1) : "N/A"}
          </div>
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-genre">{(movie.genre || ["Drama"])[0]}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieGallery;
