import React, { useState, useMemo } from "react";
import { Container, Form, InputGroup, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Search,
  Film,
  Star,
  Sparkles,
  Calendar,
  Crown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import "./MovieGallery.css";

const MovieGallery = ({ movies, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");

  // Get all unique genres for filter dropdown
  const allGenres = useMemo(() => {
    const genres = new Set();
    movies.forEach((movie) => {
      movie.genre.forEach((g) => genres.add(g));
    });
    return ["All", ...Array.from(genres)].sort();
  }, [movies]);

  // Filter movies for "All Movies" section only (not featured)
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGenre =
        genreFilter === "All" || movie.genre.includes(genreFilter);
      return matchesSearch && matchesGenre;
    });
  }, [movies, searchTerm, genreFilter]);

  // Categorize movies for the two rows only
  const movieCategories = useMemo(() => {
    return {
      // Featured - Top rated movies (8.0+) - NOT affected by search/filter
      featured: movies
        .filter((m) => m.rating >= 8.0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10),

      // All Movies - sorted by rating - affected by search/filter
      all: filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    };
  }, [movies, filteredMovies]);

  if (loading) {
    return (
      <div className="netflix-loading">
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
      <div className="netflix-error">
        <div className="error-content">
          <Film size={48} className="error-icon" />
          <h2>Loading Movies...</h2>
          <p>Preparing your cinematic experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="netflix-gallery">
      {/* Header */}
      <div className="netflix-header">
        <Container>
          <h1 className="netflix-title">
            <Film size={32} />
            Movie Collection
          </h1>
          <p className="netflix-subtitle">
            Discover and explore our curated selection of historical movies
          </p>
        </Container>
      </div>

      {/* Movie Rows */}
      <div className="netflix-content">
        {/* Featured Movies Row */}
        {movieCategories.featured.length > 0 && (
          <NetflixRow
            title="Featured Historical Movies"
            icon={<Sparkles size={24} />}
            movies={movieCategories.featured}
            showRanking={true}
            rowType="poster"
          />
        )}

        {/* Search and Filter - Below Featured Movies */}
        <div className="netflix-search-section">
          <Container>
            <div className="netflix-search-container">
              <div className="d-flex gap-3 align-items-center">
                <InputGroup size="lg" className="flex-grow-1">
                  <InputGroup.Text className="netflix-search-icon">
                    <Search size={20} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search for movies, actors, directors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="netflix-search-input"
                  />
                </InputGroup>

                {/* Genre Filter Dropdown */}
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-warning"
                    size="lg"
                    className="d-flex align-items-center gap-2"
                  >
                    <Filter size={20} />
                    {genreFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bg-dark border-warning">
                    {allGenres.map((genre) => (
                      <Dropdown.Item
                        key={genre}
                        className={`text-light ${
                          genreFilter === genre ? "bg-warning text-dark" : ""
                        }`}
                        onClick={() => setGenreFilter(genre)}
                      >
                        {genre}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Container>
        </div>

        {/* All Movies Row */}
        {movieCategories.all.length > 0 && (
          <NetflixRow
            title={`All Movies ${
              genreFilter !== "All" ? `- ${genreFilter}` : ""
            }`}
            icon={<Film size={24} />}
            movies={movieCategories.all}
            showRanking={false}
            rowType="standard"
          />
        )}

        {/* No Results Message */}
        {movieCategories.all.length === 0 && (
          <Container>
            <div className="text-center py-5">
              <Film size={48} className="text-warning mb-3" />
              <h3 className="text-light">No movies found</h3>
              <p className="text-muted">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </Container>
        )}
      </div>
    </div>
  );
};

// Netflix Row Component with Framer Motion
const NetflixRow = ({
  title,
  icon,
  movies,
  showRanking = false,
  rowType = "standard",
}) => {
  const scrollContainerRef = React.useRef(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  // Framer Motion scroll value
  const scrollX = useMotionValue(0);
  const springScrollX = useSpring(scrollX, {
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  });

  // Different card dimensions based on rowType
  const cardWidth = rowType === "poster" ? 250 : 200;
  const cardHeight = rowType === "poster" ? 425 : 300;
  const gap = 8;
  const cardsToShow = rowType === "poster" ? 8 : 6;
  const scrollAmount = (cardWidth + gap) * cardsToShow;

  // Calculate max scroll distance
  const maxScrollWidth =
    movies.length * (cardWidth + gap) - (cardWidth + gap) * cardsToShow;

  const scrollLeft = () => {
    const currentX = scrollX.get();
    const newX = Math.max(0, currentX - scrollAmount);
    scrollX.set(newX);
    updateArrowVisibility(newX);
  };

  const scrollRight = () => {
    const currentX = scrollX.get();
    const newX = Math.min(maxScrollWidth, currentX + scrollAmount);
    scrollX.set(newX);
    updateArrowVisibility(newX);
  };

  const updateArrowVisibility = (currentX) => {
    setShowLeftArrow(currentX > 0);
    setShowRightArrow(currentX < maxScrollWidth - 10);
  };

  React.useEffect(() => {
    updateArrowVisibility(0);
  }, [movies]);

  return (
    <div className="netflix-row">
      <Container>
        <div className="netflix-row-header">
          <h2 className="netflix-row-title">
            {icon}
            {title}
          </h2>
          <span className="netflix-row-count">{movies.length} movies</span>
        </div>
      </Container>

      <div
        className={`netflix-scroll-container ${
          showLeftArrow ? "has-left-content" : ""
        }`}
        ref={scrollContainerRef}
      >
        {/* Left Arrow */}
        {showLeftArrow && (
          <motion.button
            className="netflix-scroll-arrow netflix-scroll-left"
            onClick={scrollLeft}
            aria-label="Scroll left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <motion.button
            className="netflix-scroll-arrow netflix-scroll-right"
            onClick={scrollRight}
            aria-label="Scroll right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        )}

        <div className="netflix-movies-row-container">
          <motion.div
            className="netflix-movies-row"
            style={{
              x: useTransform(springScrollX, (value) => -value),
              display: "flex",
              gap: `${gap}px`,
            }}
          >
            {movies.map((movie, index) => (
              <NetflixMovieCard
                key={movie.id}
                movie={movie}
                ranking={showRanking ? index + 1 : null}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                rowType={rowType}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Netflix Movie Card Component with Framer Motion
const NetflixMovieCard = ({
  movie,
  ranking,
  cardWidth,
  cardHeight,
  rowType,
}) => {
  const getYear = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).getFullYear() || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  return (
    <motion.div
      className="netflix-movie-card-wrapper"
      style={{
        width: cardWidth,
        height: cardHeight,
        flexShrink: 0,
      }}
      whileHover={{
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={`/movies/${movie.id}`} className="netflix-movie-link">
        <div className="netflix-movie-card">
          {/* Featured Badge */}
          {ranking === 1 && (
            <motion.div
              className="netflix-featured-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Crown size={12} />
              FEATURED
            </motion.div>
          )}

          {/* Top 10 Badge */}
          {ranking && ranking <= 10 && (
            <motion.div
              className="netflix-ranking-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              #{ranking}
            </motion.div>
          )}

          {/* Movie Image */}
          <motion.img
            src={movie.image}
            alt={movie.title}
            className="netflix-movie-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
          />

          {/* Movie Info Overlay */}
          <motion.div
            className="netflix-movie-info"
            initial={{ y: "100%" }}
            whileHover={{
              y: 0,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <h3 className="netflix-movie-title">{movie.title}</h3>
            <div className="netflix-movie-meta">
              <span className="netflix-movie-year">
                <Calendar size={12} />
                {getYear(movie.releaseDate)}
              </span>
              <span className="netflix-movie-genre">
                {(movie.genre || ["Drama"])[0]}
              </span>
              <span className="netflix-movie-rating">
                <Star size={12} fill="currentColor" />
                {movie.rating ? movie.rating.toFixed(1) : "N/A"}
              </span>
            </div>
          </motion.div>

          {/* Quick Rating Badge */}
          <motion.div
            className="netflix-quick-rating"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Star size={14} fill="currentColor" />
            {movie.rating ? movie.rating.toFixed(1) : "N/A"}
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieGallery;
