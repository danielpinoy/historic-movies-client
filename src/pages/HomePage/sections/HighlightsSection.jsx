import React, { useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import "./HighlightsSection.css";
const HighlightsSection = ({ movies }) => {
  const [activeTab, setActiveTab] = useState("featured");

  // Get top-rated movies for highlights
  const getHighlightMovies = () => {
    if (!movies || movies.length === 0) return [];

    // Sort by rating and get top 4
    const sortedMovies = [...movies]
      .filter((movie) => movie.rating && movie.rating > 7)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);

    return sortedMovies;
  };

  const highlightMovies = getHighlightMovies();

  if (highlightMovies.length === 0) return null;

  return (
    <section className="highlights-section">
      <Container>
        <div className="highlights-header">
          <div>
            <h2 className="highlights-title">Highlights today</h2>
            <p className="highlights-subtitle">
              Be sure not to miss these reviews today.
            </p>
          </div>

          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "author" ? "active" : ""}`}
              onClick={() => setActiveTab("author")}
            >
              Author Picks
            </button>
            <button
              className={`tab-btn ${activeTab === "featured" ? "active" : ""}`}
              onClick={() => setActiveTab("featured")}
            >
              Featured
            </button>
            <button
              className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
              onClick={() => setActiveTab("new")}
            >
              New
            </button>
          </div>
        </div>

        <Row className="mt-5">
          {highlightMovies.map((movie, index) => (
            <Col lg={3} md={6} key={movie.id} className="mb-4">
              <Card className="highlight-card h-100">
                <div className="card-image-wrapper">
                  <Badge bg="warning" className="rating-badge">
                    {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                  </Badge>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="card-img"
                  />
                  <div className="card-overlay">
                    <div className="card-content">
                      <h4 className="movie-title">{movie.title}</h4>
                      <p className="movie-description">
                        {movie.description.length > 100
                          ? movie.description.substring(0, 100) + "..."
                          : movie.description}
                      </p>
                    </div>
                  </div>
                </div>

                <Card.Body className="card-footer">
                  <div className="rating-stars">
                    {"★".repeat(Math.floor(movie.rating / 2))}
                    {"☆".repeat(5 - Math.floor(movie.rating / 2))}
                  </div>
                  <h5 className="movie-title-footer">{movie.title}</h5>
                  <div className="movie-genres">
                    {movie.genre.slice(0, 2).map((g, i) => (
                      <span key={i} className="genre-tag">
                        {g}
                      </span>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HighlightsSection;
