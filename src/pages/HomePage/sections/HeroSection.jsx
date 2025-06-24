import React from "react";
import { Container, Row, Col, Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const HeroSection = ({ movies }) => {
  // Get featured movie (first one or one marked as featured)
  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  // Get secondary movies for sidebar
  const secondaryMovies = movies
    .filter((m) => m.id !== featuredMovie?.id)
    .slice(0, 3);

  // Mock rating for demo (you can add this to your movie data)
  const getFakeRating = (movie) => {
    const ratings = ["7.9", "8.2", "7.6", "8.8", "7.3", "9.1"];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  if (!featuredMovie) return null;

  return (
    <section
      className="hero-section py-5"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        minHeight: "70vh",
      }}
    >
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex align-items-center mb-2">
              <span className="text-warning me-3" style={{ fontSize: "2rem" }}>
                🎬
              </span>
              <h1
                className="text-white fw-bold mb-0"
                style={{ fontSize: "2.5rem" }}
              >
                Movie Reviews
              </h1>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Featured Movie - Left Side */}
          <Col lg={8} className="mb-4">
            <Card
              className="bg-transparent border-0 text-white h-100"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${featuredMovie.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <Card.Body className="p-5">
                {/* Rating Badge */}
                <div className="mb-3">
                  <Badge
                    bg="warning"
                    text="dark"
                    className="fs-4 fw-bold px-3 py-2"
                    style={{ borderRadius: "50px" }}
                  >
                    {getFakeRating(featuredMovie)}
                  </Badge>
                </div>

                {/* Movie Title */}
                <h2
                  className="text-white fw-bold mb-3"
                  style={{ fontSize: "2.5rem" }}
                >
                  {featuredMovie.title}
                </h2>

                {/* Metadata */}
                <div className="mb-4">
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    {/* Genres */}
                    <div className="d-flex gap-2">
                      {featuredMovie.genre.slice(0, 2).map((genre, index) => (
                        <Badge key={index} bg="secondary" className="px-3 py-1">
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    {/* Release Date */}
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
                  }}
                >
                  {featuredMovie.description}
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
              </Card.Body>
            </Card>
          </Col>

          {/* Secondary Movies - Right Sidebar */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-3 h-100">
              {secondaryMovies.map((movie, index) => (
                <Card
                  key={movie.id}
                  className="bg-dark text-white border-secondary"
                  style={{ borderRadius: "10px" }}
                >
                  <Row className="g-0">
                    <Col xs={4}>
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="img-fluid h-100"
                        style={{
                          objectFit: "cover",
                          borderRadius: "10px 0 0 10px",
                        }}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Body className="p-3">
                        {/* Rating */}
                        <Badge
                          bg="warning"
                          text="dark"
                          className="mb-2 fw-bold"
                        >
                          {getFakeRating(movie)}
                        </Badge>

                        {/* Title */}
                        <h6 className="text-white fw-bold mb-2">
                          {movie.title}
                        </h6>

                        {/* Metadata */}
                        <div className="mb-2">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="text-warning">⭐⭐⭐⭐⭐</span>
                          </div>
                          <small className="text-warning">
                            🏷️ {movie.genre[0]}
                          </small>
                          <span className="text-muted mx-2">•</span>
                          <small className="text-muted">
                            📅 {movie.ReleaseDate?.slice(0, 4)}
                          </small>
                        </div>

                        {/* Read More Link */}
                        <Link to={`/movies/${movie.id}`}>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="fw-medium"
                          >
                            READ MORE
                          </Button>
                        </Link>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
