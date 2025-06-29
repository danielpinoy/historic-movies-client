import React, { useState } from "react";
import "./NewReleasesSection.css";

const NewReleasesSection = ({ movies = [] }) => {
  const [activeTab, setActiveTab] = useState("latest");

  // Get newest movies for new releases
  const getNewReleaseMovies = () => {
    if (!movies || movies.length === 0) return [];

    // Sort by release date (newest first) and get top 6
    const sortedMovies = [...movies]
      .filter((movie) => movie.releaseDate)
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, 6);

    return sortedMovies;
  };

  const newReleaseMovies = getNewReleaseMovies();

  if (newReleaseMovies.length === 0) return null;

  // Get star rating display
  const getStarRating = (rating) => {
    const stars = Math.floor((rating || 0) / 2);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <section className="new-releases-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">New Releases</h2>
            <p className="section-subtitle">
              Our most recently released reviews.
            </p>
          </div>

          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "trending" ? "active" : ""}`}
              onClick={() => setActiveTab("trending")}
            >
              Trending
            </button>
            <button
              className={`tab-btn ${activeTab === "latest" ? "active" : ""}`}
              onClick={() => setActiveTab("latest")}
            >
              Latest
            </button>
            <button
              className={`tab-btn ${activeTab === "popular" ? "active" : ""}`}
              onClick={() => setActiveTab("popular")}
            >
              Popular
            </button>
          </div>
        </div>

        <div className="movies-layout">
          {/* Large movie card on the left */}
          {newReleaseMovies[0] && (
            <div className="large-movie-card">
              <div className="large-card-image-wrapper">
                <div className="rating-badge">
                  {newReleaseMovies[0].rating
                    ? newReleaseMovies[0].rating.toFixed(1)
                    : "8.5"}
                </div>
                <img
                  src={
                    newReleaseMovies[0].image ||
                    "https://via.placeholder.com/500x700?text=No+Image"
                  }
                  alt={newReleaseMovies[0].title || "Movie poster"}
                  className="large-card-img"
                />

                {/* Large card overlay with title and description */}
                <div className="large-card-overlay">
                  <div className="large-overlay-content">
                    <h2 className="large-movie-title">
                      {newReleaseMovies[0].title}
                    </h2>
                    <p className="large-movie-description">
                      {newReleaseMovies[0].description ||
                        "Lorem ipsum dolor sit amet, consectetur elit."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Large card bottom info */}
              <div className="large-card-bottom">
                <div className="star-rating">
                  {getStarRating(newReleaseMovies[0].rating)}
                </div>
                <h3 className="large-card-title">
                  {newReleaseMovies[0].title}
                </h3>
                <div className="large-card-genre">
                  <span className="genre-tag">
                    🏷️ {(newReleaseMovies[0].genre || ["Horror"])[0]}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Small movie cards on the right - 2x2 grid */}
          <div className="small-cards-grid">
            {newReleaseMovies.slice(1, 5).map((movie, index) => (
              <div key={movie.id || index} className="small-movie-card">
                <div className="small-card-image-wrapper">
                  <div className="small-rating-badge">
                    {movie.rating
                      ? movie.rating.toFixed(1)
                      : (8.8 - index * 0.2).toFixed(1)}
                  </div>
                  <img
                    src={
                      movie.image ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={movie.title || "Movie poster"}
                    className="small-card-img"
                  />
                </div>

                <div className="small-card-content">
                  <div className="small-star-rating">
                    {getStarRating(movie.rating)}
                  </div>
                  <h4 className="small-movie-title">{movie.title}</h4>
                  <div className="small-movie-meta">
                    <span className="small-genre-tag">
                      🏷️ {(movie.genre || ["Science-Fiction"])[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewReleasesSection;
