import { Button, Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { addFavoriteMovieToUser } from "../../../asyncThunk/userAsyncThunks";
import { useDispatch, useSelector } from "react-redux";

const MovieView = ({ movies, handleReset }) => {
  const { user, loading, error } = useSelector((state) => state.user);
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const isMovieInFavorites = user.FavoriteMovies.includes(String(movieId));
  const movie = movies.find((m) => m.id === movieId);
  const similarMovies = movies
    .filter(
      (m) =>
        m.id !== movieId && m.genre.some((genre) => movie.genre.includes(genre))
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <Card className="movie-view-card">
      <Row className="g-0">
        <Col md={4}>
          <Card.Img
            src={movie.image}
            alt={`${movie.title} Poster`}
            className="card-img"
          />
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title className="text-hierarchy-page-title">
              {movie.title}
            </Card.Title>

            <Card.Text>
              <Row className="movie-metadata">
                <Col>
                  <strong>Released:</strong> {movie.ReleaseDate.slice(0, 4)}
                </Col>
                <Col>
                  <strong>Runtime:</strong> {movie.Runtime}
                </Col>
                <Col>
                  <strong>Genre:</strong> {movie.genre.join(", ")}
                </Col>
              </Row>

              <Row className="movie-description">
                <Col className="mt-3 mb-3">{movie.description}</Col>
              </Row>
            </Card.Text>

            <div className="similar-movies-section">
              <Col className="text-hierarchy-section-header">
                🎬 You Might Also Like
              </Col>
              <Row>
                {similarMovies.map((movie) => (
                  <Col sm={4} key={movie.id} className="my-1">
                    <Link to={`/Movies/${movie.id}`} className="movie-link">
                      <div className="movie-title">{movie.title}</div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="movie-actions d-flex justify-content-between mt-4">
              <Link to={"/"}>
                <Button variant="secondary" onClick={handleReset}>
                  ← Back to Movies
                </Button>
              </Link>

              {isMovieInFavorites ? (
                <Button variant="outline-warning" disabled>
                  ⭐ Already in Favorites
                </Button>
              ) : (
                <>
                  {error && (
                    <Alert variant="danger" className="flex-grow-1 mx-3">
                      {error}
                    </Alert>
                  )}
                  <Button
                    onClick={() => {
                      dispatch(
                        addFavoriteMovieToUser({
                          userId: user._id,
                          movieId,
                        })
                      );
                    }}
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-1"
                          variant="light"
                        />
                        Adding...
                      </>
                    ) : (
                      "⭐ Add To Favorites"
                    )}
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default MovieView;
