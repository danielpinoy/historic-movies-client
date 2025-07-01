import React from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NewReleasesSection.css";

const NewReleasesSection = ({ movies = [] }) => {
  // Get newest movies for new releases
  console.log("First movie object:", movies[0]);

  const getNewReleaseMovies = () => {
    if (!movies || movies.length === 0) return [];

    const sortedMovies = [...movies]
      .filter((movie) => movie.releaseDate)
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, 4); // Get 4 movies for magazine layout (1 featured + 3 sidebar)

    return sortedMovies;
  };

  const newReleaseMovies = getNewReleaseMovies();
  if (newReleaseMovies.length === 0) return null;

  const [featuredMovie, ...sidebarMovies] = newReleaseMovies;

  const getStarRating = (rating) => {
    const stars = Math.floor((rating || 0) / 2);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <section className="magazine-releases">
      <Container>
        {/* Section Header */}
        <div className="magazine-header">
          <h2 className="magazine-title">New Releases</h2>
          <p className="magazine-subtitle">
            Our most recently released reviews in a curated collection.
          </p>
        </div>

        {/* Magazine Layout */}
        <Row className="magazine-layout">
          {/* Featured Card - Left Side (2/3 width) */}
          <Col lg={8} md={7} className="mb-4">
            <Link to={`/movies/${featuredMovie.id}`} className="magazine-link">
              <div className="magazine-featured-card">
                <div className="magazine-featured-image-wrapper">
                  <img
                    src={featuredMovie.images.backdrop}
                    alt={featuredMovie.title}
                    className="magazine-featured-image"
                  />

                  {/* Rating Badge */}
                  <Badge className="magazine-featured-rating">
                    {featuredMovie.rating
                      ? featuredMovie.rating.toFixed(1)
                      : "8.0"}
                  </Badge>

                  {/* NEW Badge */}
                  <Badge bg="danger" className="magazine-featured-new">
                    NEW
                  </Badge>

                  {/* Overlay Content */}
                  <div className="magazine-featured-overlay">
                    <div className="magazine-featured-content">
                      <h3 className="magazine-featured-title">
                        {featuredMovie.title}
                      </h3>

                      <div className="magazine-featured-meta">
                        <span className="magazine-featured-stars">
                          {getStarRating(featuredMovie.rating)}
                        </span>
                        <span className="magazine-featured-genre">
                          {(featuredMovie.genre || ["Drama"])[0]}
                        </span>
                        <span className="magazine-featured-year">
                          {featuredMovie.releaseDate
                            ? new Date(featuredMovie.releaseDate).getFullYear()
                            : "2024"}
                        </span>
                      </div>

                      <p className="magazine-featured-description">
                        {featuredMovie.description &&
                        featuredMovie.description.length > 150
                          ? featuredMovie.description.substring(0, 150) + "..."
                          : featuredMovie.description ||
                            "Discover this amazing new release."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Col>

          {/* Sidebar Cards - Right Side (1/3 width) */}
          <Col lg={4} md={5}>
            <div className="magazine-sidebar">
              {sidebarMovies.map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="magazine-link"
                >
                  <div className="magazine-sidebar-card">
                    <div className="magazine-sidebar-image-wrapper">
                      <img
                        src={[movie.image]}
                        alt={movie.title}
                        className="magazine-sidebar-image"
                      />

                      {/* Rating Badge */}
                      <Badge className="magazine-sidebar-rating">
                        {movie.rating ? movie.rating.toFixed(1) : "8.0"}
                      </Badge>

                      {/* NEW Badge */}
                      <Badge bg="danger" className="magazine-sidebar-new">
                        NEW
                      </Badge>
                    </div>

                    <div className="magazine-sidebar-content">
                      <h4 className="magazine-sidebar-title">{movie.title}</h4>
                      <div className="magazine-sidebar-meta">
                        <span className="magazine-sidebar-stars">
                          {getStarRating(movie.rating)}
                        </span>
                        <span className="magazine-sidebar-genre">
                          {(movie.genre || ["Drama"])[0]}
                        </span>
                        <span className="magazine-sidebar-year">
                          {movie.releaseDate
                            ? new Date(movie.releaseDate).getFullYear()
                            : "2024"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Col>
        </Row>

        {/* View All Button */}
        <div className="magazine-cta">
          <Link to="/movies" className="btn btn-warning btn-lg magazine-btn">
            View All New Releases
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default NewReleasesSection;
