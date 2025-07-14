import React, { useState, useMemo } from "react";
import { Container, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Search,
  Film,
  Star,
  Award,
  Sparkles,
  Sword,
  Drama,
  Calendar,
  Trophy,
  Crown,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./MovieGallery.css";

const MovieGallery = ({ movies, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter movies based on search
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  // Categorize movies for different rows
  const movieCategories = useMemo(() => {
    return {
      // Featured - Top rated movies (8.0+)
      featured: filteredMovies
        .filter((m) => m.rating >= 8.0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10),

      // War Movies
      war: filteredMovies
        .filter((m) =>
          m.genre.some(
            (g) =>
              g.toLowerCase().includes("war") ||
              g.toLowerCase().includes("action")
          )
        )
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10),

      // Drama Movies
      drama: filteredMovies
        .filter((m) => m.genre.some((g) => g.toLowerCase().includes("drama")))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10),

      // Highly Rated (7.5+)
      highRated: filteredMovies
        .filter((m) => m.rating >= 7.5 && m.rating < 8.0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10),

      // Popular (by vote count)
      popular: filteredMovies
        .filter((m) => m.voteCount >= 500)
        .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
        .slice(0, 10),
    };
  }, [filteredMovies]);

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
          <h2>Something went wrong</h2>
          <p>{error}</p>
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

      {/* Search */}
      <div className="netflix-search-section">
        <Container>
          <div className="netflix-search-container">
            <InputGroup size="lg">
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
          </div>
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
            rowType="featured"
            showRanking={true}
          />
        )}

        {/* War Movies Row */}
        {movieCategories.war.length > 0 && (
          <NetflixRow
            title="War & Action Movies"
            icon={<Sword size={24} />}
            movies={movieCategories.war}
            rowType="standard"
            genreBadge="WAR"
          />
        )}

        {/* Drama Movies Row */}
        {movieCategories.drama.length > 0 && (
          <NetflixRow
            title="Classic Dramas"
            icon={<Drama size={24} />}
            movies={movieCategories.drama}
            rowType="poster"
          />
        )}

        {/* Highly Rated Row */}
        {movieCategories.highRated.length > 0 && (
          <NetflixRow
            title="Critically Acclaimed"
            icon={<Award size={24} />}
            movies={movieCategories.highRated}
            rowType="standard"
          />
        )}

        {/* Popular Movies Row */}
        {movieCategories.popular.length > 0 && (
          <NetflixRow
            title="Popular Choices"
            icon={<Trophy size={24} />}
            movies={movieCategories.popular}
            rowType="poster"
          />
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
  rowType = "standard",
  showRanking = false,
  genreBadge = null,
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

  // Calculate scroll amount and card width based on row type
  const getCardDimensions = () => {
    switch (rowType) {
      case "featured":
        return { width: 300, gap: 8, cardsToShow: 3 };
      case "standard":
        return { width: 250, gap: 8, cardsToShow: 4 };
      case "poster":
        return { width: 150, gap: 8, cardsToShow: 6 };
      default:
        return { width: 250, gap: 8, cardsToShow: 4 };
    }
  };

  const { width: cardWidth, gap, cardsToShow } = getCardDimensions();
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
    setShowRightArrow(currentX < maxScrollWidth - 10); // Small buffer
  };

  React.useEffect(() => {
    // Initial arrow state
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

      <div className="netflix-scroll-container">
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
            ref={scrollContainerRef}
            className={`netflix-movies-row ${rowType}-row`}
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
                rowType={rowType}
                ranking={showRanking ? index + 1 : null}
                genreBadge={genreBadge}
                cardWidth={cardWidth}
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
  rowType,
  ranking,
  genreBadge,
  cardWidth,
}) => {
  const getImageUrl = () => {
    // Always use the main image but with different Cloudinary transformations
    const baseImage = movie.image;

    if (rowType === "poster") {
      // For poster rows, use 2:3 aspect ratio
      return baseImage?.replace(/w_\d+,h_\d+/, "w_200,h_300") || baseImage;
    } else {
      // For landscape rows (featured/standard), use 16:9 aspect ratio
      return baseImage?.replace(/w_\d+,h_\d+/, "w_400,h_225") || baseImage;
    }
  };

  const getYear = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).getFullYear() || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  const getCardHeight = () => {
    switch (rowType) {
      case "featured":
        return 169;
      case "standard":
        return 141;
      case "poster":
        return 225;
      default:
        return 141;
    }
  };

  return (
    <motion.div
      className="netflix-movie-card-wrapper"
      style={{
        width: cardWidth,
        height: getCardHeight(),
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

          {/* Genre Badge */}
          {genreBadge && (
            <motion.div
              className="netflix-genre-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {genreBadge}
            </motion.div>
          )}

          {/* Movie Image */}
          <motion.img
            src={getImageUrl()}
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
