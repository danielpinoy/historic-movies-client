import React from "react";
import { Link } from "react-router-dom";
import "./NewReleasesSection.css";

const NewReleasesSection = ({ movies = [] }) => {
  // Get newest movies for new releases
  const getNewReleaseMovies = () => {
    if (!movies || movies.length === 0) return [];

    const sortedMovies = [...movies]
      .filter((movie) => movie.releaseDate)
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, 7); // 1 hero + 6 grid cards

    return sortedMovies;
  };

  const newReleaseMovies = getNewReleaseMovies();
  if (newReleaseMovies.length === 0) return null;

  const [heroMovie, ...gridMovies] = newReleaseMovies;

  const getStarRating = (rating) => {
    const stars = Math.floor((rating || 0) / 2);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <section className="netflix-releases">
      <div className="netflix-container">
        {/* Section Title */}
        <div className="netflix-header">
          <h2 className="netflix-title">New Releases</h2>
          <p className="netflix-subtitle">
            Our most recently released reviews.
          </p>
        </div>

        {/* HERO CARD - Full Width at Top */}
        <Link to={`/movies/${heroMovie.id}`} className="netflix-hero-link">
          <div className="netflix-hero">
            <img
              src={heroMovie.image}
              alt={heroMovie.title}
              className="netflix-hero-image"
            />

            <div className="netflix-hero-overlay">
              <div className="netflix-hero-content">
                <span className="netflix-new-badge">NEW</span>
                <h3 className="netflix-hero-title">{heroMovie.title}</h3>
                <div className="netflix-hero-meta">
                  <span className="netflix-hero-rating">
                    {getStarRating(heroMovie.rating)}
                  </span>
                  <span className="netflix-hero-genre">
                    {(heroMovie.genre || ["Drama"])[0]}
                  </span>
                  <span className="netflix-hero-year">
                    {heroMovie.releaseDate
                      ? new Date(heroMovie.releaseDate).getFullYear()
                      : "2024"}
                  </span>
                </div>
                <p className="netflix-hero-description">
                  {heroMovie.description && heroMovie.description.length > 180
                    ? heroMovie.description.substring(0, 180) + "..."
                    : heroMovie.description ||
                      "Discover this amazing new release."}
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* GRID CARDS - Below Hero */}
        <div className="netflix-grid-container">
          <div className="netflix-grid">
            {gridMovies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="netflix-grid-link"
              >
                <div className="netflix-card">
                  <div className="netflix-card-image-wrapper">
                    <span className="netflix-card-rating">
                      {movie.rating ? movie.rating.toFixed(1) : "8.0"}
                    </span>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="netflix-card-image"
                    />
                  </div>

                  <div className="netflix-card-info">
                    <div className="netflix-card-stars">
                      {getStarRating(movie.rating)}
                    </div>
                    <h4 className="netflix-card-title">{movie.title}</h4>
                    <span className="netflix-card-genre">
                      {(movie.genre || ["Drama"])[0]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewReleasesSection;
