import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import HeroSectionSkeleton from "../skeleton/HS_Skeleton";

import "./HeroSection.css";

const HeroSection = ({ movies, loading = false }) => {
  const [currentMovieSet, setCurrentMovieSet] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // Force re-animation

  // Function to get a random set of 4 movies
  const getRandomMovieSet = () => {
    if (movies.length < 4) return movies;

    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Initialize with random movies on component mount
  useEffect(() => {
    if (movies && movies.length >= 4) {
      setCurrentMovieSet(getRandomMovieSet());
    }
  }, [movies]);

  // Cycle through movies
  useEffect(() => {
    if (movies && movies.length >= 4) {
      const interval = setInterval(() => {
        setIsTransitioning(true);

        // Small delay for transition effect
        setTimeout(() => {
          setCurrentMovieSet(getRandomMovieSet());
          setAnimationKey((prev) => prev + 1); // Trigger new animations
          setIsTransitioning(false);
        }, 300);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [movies]);

  // Show skeleton while loading - MOVED AFTER HOOKS
  if (loading || !movies || movies.length < 4) {
    return <HeroSectionSkeleton />;
  }

  // Return empty if no movies set yet - MOVED AFTER HOOKS
  if (currentMovieSet.length === 0) {
    return <HeroSectionSkeleton />;
  }

  const [featuredMovie, ...secondaryMovies] = currentMovieSet;

  // Get real rating from movie data
  const getRating = (movie) => {
    return movie.rating || movie.Rating || "N/A";
  };
  console.log(featuredMovie.images);

  return (
    <section className="hero-section">
      {/* Movie Grid - Full Width */}
      <div className="px-0">
        <Row
          className="g-0"
          key={animationKey} // Force re-render for animations
        >
          {/* Large Movie Card - Left Side */}
          <Col lg={8}>
            <Card
              className="hero-card hero-card-main h-100 bg-transparent border-0 text-white position-relative overflow-hidden"
              style={{
                borderRadius: "15px",
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${
                  featuredMovie.heroImage || featuredMovie.image
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Card.Body className="p-4 d-flex flex-column justify-content-between h-100">
                {/* Rating Badge - Top */}
                <div className="align-self-start">
                  <Badge
                    bg="warning"
                    text="dark"
                    className="hero-rating-badge fs-4 fw-bold px-3 py-2"
                    style={{ borderRadius: "50px" }}
                  >
                    {getRating(featuredMovie)}
                  </Badge>
                </div>

                {/* Movie Info - Bottom */}
                <div>
                  <h2
                    className="hero-title text-white fw-bold mb-3"
                    style={{
                      fontSize: "3rem",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {featuredMovie.title}
                  </h2>

                  {/* Metadata */}
                  <div className="hero-metadata mb-3">
                    <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                      <Badge bg="secondary" className="px-3 py-1">
                        {featuredMovie.genre[0]}
                      </Badge>
                      <span className="text-warning">
                        📅{" "}
                        {featuredMovie.releaseDate
                          ? new Date(featuredMovie.releaseDate).getFullYear()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Synopsis */}
                  <p
                    className="hero-description text-light mb-4"
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.6",
                      maxWidth: "600px",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {featuredMovie.description &&
                    featuredMovie.description.length > 200
                      ? featuredMovie.description.substring(0, 200) + "..."
                      : featuredMovie.description}
                  </p>

                  {/* Read More Button */}
                  <div className="hero-button">
                    <Link to={`/movies/${featuredMovie.id}`}>
                      <Button
                        variant="warning"
                        size="lg"
                        className="fw-semibold text-dark px-4 py-2"
                        style={{ borderRadius: "25px" }}
                      >
                        READ MORE
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side - 3 Movies */}
          <Col lg={4}>
            <div className="h-100 d-flex flex-column">
              {/* Top Movie - Takes up 50% height */}
              {secondaryMovies[0] && (
                <Card
                  className="hero-card hero-card-secondary-1 text-white border-0 position-relative overflow-hidden"
                  style={{
                    height: "50%",
                    borderRadius: "0",
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${secondaryMovies[0].image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Card.Body className="p-3 d-flex flex-column justify-content-between h-100">
                    <Badge
                      bg="warning"
                      text="dark"
                      className="hero-rating-badge align-self-start fw-bold"
                    >
                      {getRating(secondaryMovies[0])}
                    </Badge>

                    <div>
                      <h5 className="text-white fw-bold mb-2">
                        {secondaryMovies[0].title}
                      </h5>
                      <div className="mb-2">
                        <small className="text-warning">
                          🏷️ {secondaryMovies[0].genre[0]}
                        </small>
                        <span className="text-muted mx-1">•</span>
                        <small className="text-muted">
                          📅{" "}
                          {secondaryMovies[0].releaseDate
                            ? new Date(
                                secondaryMovies[0].releaseDate
                              ).getFullYear()
                            : "Unknown"}
                        </small>
                      </div>
                      <Link to={`/movies/${secondaryMovies[0].id}`}>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="fw-medium"
                        >
                          READ MORE
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Bottom Two Movies - Side by Side */}
              <Row className="flex-grow-1 g-0 h-50">
                {secondaryMovies.slice(1, 3).map((movie, index) => (
                  <Col xs={6} key={movie.id}>
                    <Card
                      className={`hero-card hero-card-secondary-${
                        index + 2
                      } h-100 text-white border-0 position-relative overflow-hidden`}
                      style={{
                        borderRadius: "0",
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${movie.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Card.Body className="p-3 d-flex flex-column justify-content-between h-100">
                        <Badge
                          bg="warning"
                          text="dark"
                          className="hero-rating-badge align-self-start fw-bold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {getRating(movie)}
                        </Badge>

                        <div>
                          <h6 className="text-white fw-bold mb-2">
                            {movie.title}
                          </h6>
                          <div className="mb-2">
                            <small className="text-warning d-block">
                              🏷️ {movie.genre[0]}
                            </small>
                            <small className="text-muted">
                              📅{" "}
                              {movie.releaseDate
                                ? new Date(movie.releaseDate).getFullYear()
                                : "Unknown"}
                            </small>
                          </div>
                          <Link to={`/movies/${movie.id}`}>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="fw-medium"
                              style={{ fontSize: "0.75rem" }}
                            >
                              READ MORE
                            </Button>
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      {/* Enhanced Cycling Indicator
      <div className="cycling-indicator position-absolute bottom-0 start-50 translate-middle-x mb-3">
        <div className="d-flex gap-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="cycling-dot rounded-circle"
              style={{
                width: "10px",
                height: "10px",
                animation: `pulse 2s infinite ${index * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default HeroSection;
