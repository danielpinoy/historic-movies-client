import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Star, Tag, Users, Award, Eye, Gem } from "lucide-react";
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
          icon: <Award size={20} />,
        };
      case "featured":
        return {
          title: "Featured Movies",
          subtitle: "Popular acclaimed films everyone's talking about.",
          icon: <Star size={20} />,
        };
      case "hidden":
        return {
          title: "Hidden Gems",
          subtitle: "Great movies you might have missed.",
          icon: <Gem size={20} />,
        };
      default:
        return {
          title: "Highlights today",
          subtitle: "Be sure not to miss these reviews today.",
          icon: <Eye size={20} />,
        };
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <section className="highlights-section">
      <Container>
        <div className="highlights-header">
          <div>
            <h2 className="highlights-title d-flex align-items-center gap-3">
              {sectionInfo.icon}
              {sectionInfo.title}
            </h2>
            <p className="highlights-subtitle">{sectionInfo.subtitle}</p>
          </div>

          <ButtonGroup className="custom-tab-buttons">
            <Button
              variant={activeTab === "author" ? "info" : "outline-secondary"}
              className={`tab-btn ${
                activeTab === "author" ? "active author-active" : ""
              }`}
              onClick={() => setActiveTab("author")}
            >
              <span className="tab-text d-flex align-items-center gap-2">
                <Award size={16} />
                Author Picks
              </span>
            </Button>
            <Button
              variant={
                activeTab === "featured" ? "warning" : "outline-secondary"
              }
              className={`tab-btn ${
                activeTab === "featured" ? "active featured-active" : ""
              }`}
              onClick={() => setActiveTab("featured")}
            >
              <span className="tab-text d-flex align-items-center gap-2">
                <Star size={16} />
                Featured
              </span>
            </Button>
            <Button
              variant={activeTab === "hidden" ? "success" : "outline-secondary"}
              className={`tab-btn ${
                activeTab === "hidden" ? "active hidden-active" : ""
              }`}
              onClick={() => setActiveTab("hidden")}
            >
              <span className="tab-text d-flex align-items-center gap-2">
                <Gem size={16} />
                Hidden Gems
              </span>
            </Button>
          </ButtonGroup>
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
                    <Badge
                      bg="warning"
                      className="rating-badges d-flex align-items-center gap-1"
                    >
                      <Star size={14} fill="currentColor" />
                      {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                    </Badge>

                    {/* Add badge for tab type */}
                    {activeTab === "hidden" && (
                      <Badge
                        bg="success"
                        className="position-absolute top-0 start-0 m-2 d-flex align-items-center gap-1"
                      >
                        <Gem size={12} />
                        HIDDEN GEM
                      </Badge>
                    )}
                    {activeTab === "author" && (
                      <Badge
                        bg="info"
                        className="position-absolute top-0 start-0 m-2 d-flex align-items-center gap-1"
                      >
                        <Award size={12} />
                        EDITOR'S CHOICE
                      </Badge>
                    )}
                    {activeTab === "featured" && (
                      <Badge
                        bg="primary"
                        className="position-absolute top-0 start-0 m-2 d-flex align-items-center gap-1"
                      >
                        <i className="bi bi-fire"></i>
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
                          <small className="text-warning d-flex align-items-center gap-1 mt-2">
                            <Users size={12} />
                            {movie.voteCount} votes • Rating:{" "}
                            {movie.rating?.toFixed(1)}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  <Card.Body className="card-footer">
                    <div className="rating-stars d-flex align-items-center gap-1">
                      <Star
                        size={16}
                        fill="currentColor"
                        className="text-warning"
                      />
                      <Star
                        size={16}
                        fill={movie.rating >= 4 ? "currentColor" : "none"}
                        className="text-warning"
                      />
                      <Star
                        size={16}
                        fill={movie.rating >= 6 ? "currentColor" : "none"}
                        className="text-warning"
                      />
                      <Star
                        size={16}
                        fill={movie.rating >= 8 ? "currentColor" : "none"}
                        className="text-warning"
                      />
                      <Star
                        size={16}
                        fill={movie.rating >= 9 ? "currentColor" : "none"}
                        className="text-warning"
                      />
                    </div>
                    <h5 className="movie-title-footer">{movie.title}</h5>
                    <div className="movie-genres">
                      {movie.genre.slice(0, 2).map((g, i) => (
                        <span
                          key={i}
                          className="genre-tag d-flex align-items-center gap-1"
                        >
                          <Tag size={10} />
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Additional info based on tab */}
                    {activeTab === "hidden" && movie.voteCount && (
                      <small className="text-muted d-flex align-items-center gap-1 mt-1">
                        <Users size={12} />
                        Only {movie.voteCount} votes • Underrated gem
                      </small>
                    )}
                    {activeTab === "author" && movie.voteCount && (
                      <small className="text-muted d-flex align-items-center gap-1 mt-1">
                        <Users size={12} />
                        {movie.voteCount.toLocaleString()} votes
                      </small>
                    )}
                    {activeTab === "featured" && movie.voteCount && (
                      <small className="text-muted d-flex align-items-center gap-1 mt-1">
                        <Users size={12} />
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
