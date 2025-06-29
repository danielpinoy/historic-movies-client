import React from "react";
import { Container, Row, Col, Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import HeroSectionSkeleton from "../skeleton/HS_Skeleton";

const HeroSection = ({ movies, loading = false }) => {
  // Show skeleton while loading
  if (loading || !movies || movies.length < 4) {
    return <HeroSectionSkeleton />;
  }

  // Get featured movie (first one or one marked as featured)
  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  // Get secondary movies for the right side
  const secondaryMovies = movies
    .filter((m) => m.id !== featuredMovie?.id)
    .slice(0, 3);

  // Get real rating from movie data
  const getRating = (movie) => {
    return movie.rating || movie.Rating || "N/A";
  };

  return (
    <section className="hero-section">
      {/* Movie Grid - Full Width */}
      <div className="px-0">
        <Row className="g-0" style={{ height: "80vh" }}>
          {/* Large Movie Card - Left Side */}
          <Col lg={8}>
            <Card
              className="h-100 bg-transparent border-0 text-white position-relative overflow-hidden"
              style={{
                borderRadius: "15px",
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${featuredMovie.heroImage})`,
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
                    className="fs-4 fw-bold px-3 py-2"
                    style={{ borderRadius: "50px" }}
                  >
                    {getRating(featuredMovie)}
                  </Badge>
                </div>

                {/* Movie Info - Bottom */}
                <div>
                  <h2
                    className="text-white fw-bold mb-3"
                    style={{
                      fontSize: "3rem",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {featuredMovie.title}
                  </h2>

                  {/* Metadata */}
                  <div className="mb-3">
                    <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                      <span className="text-warning">⭐⭐⭐⭐⭐</span>
                      <Badge bg="secondary" className="px-3 py-1">
                        {featuredMovie.genre[0]}
                      </Badge>
                      <span className="text-warning">
                        📅 {featuredMovie.ReleaseDate?.slice(0, 4)}
                      </span>
                    </div>
                  </div>

                  {/* Synopsis */}
                  <p
                    className="text-light mb-4"
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: "1.6",
                      maxWidth: "600px",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {featuredMovie.description.length > 200
                      ? featuredMovie.description.substring(0, 200) + "..."
                      : featuredMovie.description}
                  </p>

                  {/* Read More Button */}
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
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side - 3 Movies */}
          <Col lg={4}>
            <div className="h-100 d-flex flex-column">
              {/* Top Movie - Takes up 50% height */}
              {secondaryMovies[0] && (
                <Card
                  className="text-white border-0 position-relative overflow-hidden"
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
                      className="align-self-start fw-bold"
                    >
                      {getRating(secondaryMovies[0])}
                    </Badge>

                    <div>
                      <h5 className="text-white fw-bold mb-2">
                        {secondaryMovies[0].title}
                      </h5>
                      <div className="mb-2">
                        <span className="text-warning me-2">⭐⭐⭐⭐⭐</span>
                        <small className="text-warning">
                          🏷️ {secondaryMovies[0].genre[0]}
                        </small>
                        <span className="text-muted mx-1">•</span>
                        <small className="text-muted">
                          📅 {secondaryMovies[0].ReleaseDate?.slice(0, 4)}
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
                      className="h-100 text-white border-0 position-relative overflow-hidden"
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
                          className="align-self-start fw-bold"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {getRating(movie)}
                        </Badge>

                        <div>
                          <h6 className="text-white fw-bold mb-2">
                            {movie.title}
                          </h6>
                          <div className="mb-2">
                            <div
                              className="text-warning mb-1"
                              style={{ fontSize: "0.7rem" }}
                            >
                              ⭐⭐⭐⭐⭐
                            </div>
                            <small className="text-warning d-block">
                              🏷️ {movie.genre[0]}
                            </small>
                            <small className="text-muted">
                              📅 {movie.ReleaseDate?.slice(0, 4)}
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
    </section>
  );
};

export default HeroSection;
