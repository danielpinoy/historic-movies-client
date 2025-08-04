import { Button, Card, Col, Row, Spinner, Alert, Badge } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  Users,
  Tag,
  ArrowLeft,
  Heart,
  BookOpen,
} from "lucide-react";
import { addFavoriteMovieToUser } from "../../../asyncThunk/userAsyncThunks";
import { useDispatch, useSelector } from "react-redux";
import "./movie-view.css";
const MovieView = ({ movies, handleReset }) => {
  const { user, loading, error } = useSelector((state) => state.user);
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const isMovieInFavorites = user.FavoriteMovies.includes(String(movieId));
  const movie = movies.find((m) => m.id === movieId);

  if (!movie) {
    return (
      <Alert variant="warning" className="text-center">
        Movie not found
      </Alert>
    );
  }

  const similarMovies = movies
    .filter(
      (m) =>
        m.id !== movieId && m.genre.some((genre) => movie.genre.includes(genre))
    )
    .sort((a, b) => {
      if (b.rating !== a.rating) {
        return (b.rating || 0) - (a.rating || 0);
      }
      return a.title.localeCompare(b.title);
    })
    .slice(0, 4);

  const getYear = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).getFullYear() || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="compact-movie-view">
      {/* Back Button */}
      <div className="mb-3">
        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          Back to Movies
        </Link>
      </div>

      {/* Main Movie Card */}
      <Card className="movie-detail-card bg-dark text-white border-warning">
        <Row className="g-0">
          {/* Poster Column */}
          <Col md={4} lg={3}>
            <div className="poster-container">
              <img
                src={movie.image}
                alt={`${movie.title} Poster`}
                className="poster-img"
              />
              <div className="rating-overlay">
                <div className="rating-circle">
                  <span className="rating-number">
                    {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                  </span>
                  <span className="rating-max">/10</span>
                </div>
                {movie.voteCount && (
                  <div className="vote-count">
                    {movie.voteCount.toLocaleString()} votes
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Content Column */}
          <Col md={8} lg={9}>
            <Card.Body className="movie-content">
              {/* Header Section */}
              <div className="movie-header">
                <h1 className="movie-title">{movie.title}</h1>

                {/* Genre Tags */}
                <div className="genre-tags mb-3">
                  {movie.genre.map((g, index) => (
                    <Badge key={index} bg="secondary" className="me-2">
                      <Tag size={12} className="me-1" />
                      {g}
                    </Badge>
                  ))}
                </div>

                {/* Movie Meta Info */}
                <div className="movie-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{getYear(movie.releaseDate)}</span>
                  </div>
                  {movie.runtime && (
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{movie.runtime} min</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <Star size={16} fill="currentColor" />
                    <span>
                      {movie.rating ? movie.rating.toFixed(1) : "N/A"}/10
                    </span>
                  </div>
                  {movie.voteCount && (
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{movie.voteCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="description-section">
                <h5 className="section-title">
                  <BookOpen size={18} className="me-2" />
                  Synopsis
                </h5>
                <p className="movie-description">{movie.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="action-section">
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <div className="action-buttons">
                  {isMovieInFavorites ? (
                    <Button variant="outline-warning" disabled size="lg">
                      <Star size={18} fill="currentColor" className="me-2" />
                      In Favorites
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        dispatch(
                          addFavoriteMovieToUser({
                            userId: user._id,
                            movieId,
                          })
                        );
                      }}
                      variant="warning"
                      disabled={loading}
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Heart size={18} className="me-2" />
                          Add To Favorites
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="similar-movies-section">
          <h4 className="section-title mb-3">You Might Also Like</h4>
          <Row>
            {similarMovies.map((similarMovie) => (
              <Col sm={6} md={4} lg={3} key={similarMovie.id} className="mb-3">
                <Link
                  to={`/movies/${similarMovie.id}`}
                  className="similar-movie-link"
                >
                  <Card className="similar-movie-card bg-secondary text-white h-100">
                    <div className="similar-poster">
                      <img
                        src={similarMovie.image}
                        alt={similarMovie.title}
                        className="similar-img"
                      />
                      <div className="similar-rating">
                        {similarMovie.rating
                          ? similarMovie.rating.toFixed(1)
                          : "N/A"}
                      </div>
                    </div>
                    <Card.Body className="p-2">
                      <h6 className="similar-title">{similarMovie.title}</h6>
                      <small className="text-warning">
                        {getYear(similarMovie.releaseDate)}
                      </small>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default MovieView;
