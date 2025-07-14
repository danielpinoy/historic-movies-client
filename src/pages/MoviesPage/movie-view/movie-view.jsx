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

const MovieView = ({ movies, handleReset }) => {
  const { user, loading, error } = useSelector((state) => state.user);
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const isMovieInFavorites = user.FavoriteMovies.includes(String(movieId));
  const movie = movies.find((m) => m.id === movieId);

  // Add safety check
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
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Safe date extraction
  const getYear = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).getFullYear() || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className=" py-4">
      <Card className="bg-dark text-white border-warning shadow-lg overflow-hidden">
        <Row className="g-0">
          {/* Movie Poster */}
          <Col lg={4}>
            <div className="p-3">
              <img
                src={movie.image}
                alt={`${movie.title} Poster`}
                className="img-fluid rounded shadow-lg"
                style={{
                  maxHeight: "600px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </div>
          </Col>

          {/* Movie Details */}
          <Col lg={8}>
            <Card.Body className="p-4 p-lg-5">
              {/* Movie Title */}
              <div className="mb-4">
                <h1 className="text-warning fw-bold mb-2 display-5">
                  {movie.title}
                </h1>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {movie.genre.map((g, index) => (
                    <Badge
                      key={index}
                      bg="secondary"
                      className="fs-6 d-flex align-items-center gap-1"
                    >
                      <Tag size={14} />
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Movie Metadata */}
              <Row className="mb-4">
                <Col sm={6} className="mb-3">
                  <div className="bg-secondary rounded p-3">
                    <strong className="text-warning d-flex align-items-center gap-2 mb-1">
                      <Calendar size={18} />
                      Release Year
                    </strong>
                    <span className="text-light h5 mb-0">
                      {getYear(movie.releaseDate)}
                    </span>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div className="bg-secondary rounded p-3">
                    <strong className="text-warning d-flex align-items-center gap-2 mb-1">
                      <Clock size={18} />
                      Runtime
                    </strong>
                    <span className="text-light h5 mb-0">
                      {movie.runtime
                        ? `${movie.runtime} min`
                        : movie.runtime || "Unknown"}
                    </span>
                  </div>
                </Col>
              </Row>

              {/* Rating Section */}
              {movie.rating && (
                <Row className="mb-4">
                  <Col sm={6} className="mb-3">
                    <div className="bg-secondary rounded p-3">
                      <strong className="text-warning d-flex align-items-center gap-2 mb-1">
                        <Star size={18} />
                        TMDB Rating
                      </strong>
                      <span className="text-light h5 mb-0 d-flex align-items-center gap-2">
                        <Star
                          size={20}
                          fill="currentColor"
                          className="text-warning"
                        />
                        {movie.rating}/10
                      </span>
                    </div>
                  </Col>
                  {movie.voteCount && (
                    <Col sm={6} className="mb-3">
                      <div className="bg-secondary rounded p-3">
                        <strong className="text-warning d-flex align-items-center gap-2 mb-1">
                          <Users size={18} />
                          Votes
                        </strong>
                        <span className="text-light h5 mb-0 d-flex align-items-center gap-2">
                          <Users size={20} className="text-warning" />
                          {movie.voteCount.toLocaleString()}
                        </span>
                      </div>
                    </Col>
                  )}
                </Row>
              )}

              {/* Movie Description */}
              <div className="mb-4">
                <h4 className="text-warning mb-3 d-flex align-items-center gap-2">
                  <BookOpen size={20} />
                  Synopsis
                </h4>
                <Card className="bg-secondary border-0">
                  <Card.Body>
                    <p className="text-light mb-0 lead">{movie.description}</p>
                  </Card.Body>
                </Card>
              </div>

              {/* Similar Movies */}
              {similarMovies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-warning mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-collection-play"></i>
                    You Might Also Like
                  </h4>
                  <Row>
                    {similarMovies.map((similarMovie) => (
                      <Col md={4} key={similarMovie.id} className="mb-2">
                        <Link
                          to={`/Movies/${similarMovie.id}`}
                          className="text-decoration-none"
                        >
                          <Card className="bg-secondary text-white border-0 h-100">
                            <Card.Body className="p-3">
                              <h6 className="text-warning mb-1">
                                {similarMovie.title}
                              </h6>
                              <small className="text-light d-flex align-items-center gap-1">
                                <Calendar size={12} />
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

              {/* Action Buttons */}
              <div className="border-top border-secondary pt-4">
                <Row className="align-items-center">
                  <Col md={6} className="mb-3 mb-md-0">
                    <Link to="/">
                      <Button
                        variant="outline-light"
                        onClick={handleReset}
                        size="lg"
                        className="fw-semibold d-flex align-items-center gap-2"
                      >
                        <ArrowLeft size={18} />
                        Back to Movies
                      </Button>
                    </Link>
                  </Col>

                  <Col md={6}>
                    {error && (
                      <Alert variant="danger" className="mb-3">
                        {error}
                      </Alert>
                    )}

                    {isMovieInFavorites ? (
                      <Button
                        variant="outline-warning"
                        disabled
                        size="lg"
                        className="w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                      >
                        <Star size={18} fill="currentColor" />
                        Already in Favorites
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
                        className="w-100 fw-semibold text-dark d-flex align-items-center justify-content-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Heart size={18} />
                            Add To Favorites
                          </>
                        )}
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MovieView;
