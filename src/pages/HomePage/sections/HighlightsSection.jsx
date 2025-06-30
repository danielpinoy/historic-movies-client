import React, { useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HighlightsSection.css";

const HighlightsSection = ({ movies }) => {
  const [activeTab, setActiveTab] = useState("featured");

  // Get movies based on the active tab
  const getHighlightMovies = () => {
    if (!movies || movies.length === 0) return [];

    let filteredMovies = [];

    switch (activeTab) {
      case "author":
        // Author Picks: Highest rated movies with good vote counts
        filteredMovies = [...movies]
          .filter(
            (movie) =>
              movie.rating && movie.rating > 8.0 && movie.voteCount > 100
          )
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
        break;

      case "featured":
        // Featured: Top rated movies with high vote counts (popular & acclaimed)
        filteredMovies = [...movies]
          .filter(
            (movie) =>
              movie.rating &&
              movie.rating > 7.5 &&
              movie.voteCount &&
              movie.voteCount >= 500 // Well-known movies
          )
          .sort((a, b) => {
            // Sort by a combination of rating and popularity
            const scoreA = (a.rating || 0) + (a.voteCount || 0) / 1000;
            const scoreB = (b.rating || 0) + (b.voteCount || 0) / 1000;
            return scoreB - scoreA;
          })
          .slice(0, 3);
        break;

      case "hidden":
        // Hidden Gems: Great movies with lower vote counts (underrated)
        filteredMovies = [...movies]
          .filter(
            (movie) =>
              movie.rating &&
              movie.rating >= 7.0 &&
              movie.voteCount &&
              movie.voteCount < 500 // Less discovered
          )
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
        break;

      default:
        // Fallback to featured
        filteredMovies = [...movies]
          .filter((movie) => movie.rating && movie.rating > 7)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
    }

    return filteredMovies;
  };

  const highlightMovies = getHighlightMovies();

  if (highlightMovies.length === 0) return null;

  // Get section title and subtitle based on active tab
  const getSectionInfo = () => {
    switch (activeTab) {
      case "author":
        return {
          title: "Author's Choice",
          subtitle: "Our critics' highest rated recommendations.",
        };
      case "featured":
        return {
          title: "Featured Movies",
          subtitle: "Popular acclaimed films everyone's talking about.",
        };
      case "hidden":
        return {
          title: "Hidden Gems",
          subtitle: "Great movies you might have missed.",
        };
      default:
        return {
          title: "Highlights today",
          subtitle: "Be sure not to miss these reviews today.",
        };
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <section className="highlights-section">
      <Container>
        <div className="highlights-header">
          <div>
            <h2 className="highlights-title">{sectionInfo.title}</h2>
            <p className="highlights-subtitle">{sectionInfo.subtitle}</p>
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
              className={`tab-btn ${activeTab === "hidden" ? "active" : ""}`}
              onClick={() => setActiveTab("hidden")}
            >
              Hidden Gems
            </button>
          </div>
        </div>

        <Row className="mt-5">
          {highlightMovies.map((movie, index) => (
            <Col lg={4} md={6} key={movie.id} className="mb-4">
              <Link
                to={`/movies/${movie.id}`}
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                <Card className="highlight-card h-100">
                  <div className="card-image-wrapper">
                    <Badge bg="warning" className="rating-badges">
                      {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                    </Badge>

                    {/* Add badge for tab type */}
                    {activeTab === "hidden" && (
                      <Badge
                        bg="success"
                        className="position-absolute top-0 start-0 m-2"
                      >
                        HIDDEN GEM
                      </Badge>
                    )}
                    {activeTab === "author" && (
                      <Badge
                        bg="info"
                        className="position-absolute top-0 start-0 m-2"
                      >
                        EDITOR'S CHOICE
                      </Badge>
                    )}
                    {activeTab === "featured" && (
                      <Badge
                        bg="primary"
                        className="position-absolute top-0 start-0 m-2"
                      >
                        POPULAR
                      </Badge>
                    )}

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

                        {/* Show rating info for hidden gems */}
                        {activeTab === "hidden" && movie.voteCount && (
                          <small className="text-warning d-block mt-2">
                            {movie.voteCount} votes • Rating:{" "}
                            {movie.rating?.toFixed(1)}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  <Card.Body className="card-footer">
                    <div className="rating-stars">
                      {"★".repeat(Math.floor((movie.rating || 0) / 2))}
                      {"☆".repeat(5 - Math.floor((movie.rating || 0) / 2))}
                    </div>
                    <h5 className="movie-title-footer">{movie.title}</h5>
                    <div className="movie-genres">
                      {movie.genre.slice(0, 2).map((g, i) => (
                        <span key={i} className="genre-tag">
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Additional info based on tab */}
                    {activeTab === "hidden" && movie.voteCount && (
                      <small className="text-muted d-block mt-1">
                        Only {movie.voteCount} votes • Underrated gem
                      </small>
                    )}
                    {activeTab === "author" && movie.voteCount && (
                      <small className="text-muted d-block mt-1">
                        {movie.voteCount.toLocaleString()} votes
                      </small>
                    )}
                    {activeTab === "featured" && movie.voteCount && (
                      <small className="text-muted d-block mt-1">
                        {movie.voteCount.toLocaleString()} votes • Popular
                        choice
                      </small>
                    )}
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default HighlightsSection;
