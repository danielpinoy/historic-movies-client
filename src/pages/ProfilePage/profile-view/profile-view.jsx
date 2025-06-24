import {
  Button,
  Card,
  Col,
  Row,
  ListGroup,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  removeFavoriteMovie,
} from "../../../asyncThunk/userAsyncThunks";

const ProfileView = ({ clickUpdate, movies, token }) => {
  const { user, loading, error } = useSelector((state) => state.user);
  const formattedBirthday = new Date(user.Birthday).toLocaleDateString();
  const favoriteMovies = movies.filter((m) =>
    user.FavoriteMovies.includes(m.id)
  );
  const dispatch = useDispatch();

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your Profile?"
    );
    if (confirmed) {
      dispatch(deleteUser({ user, token }));
    }
  };

  const onDeleteFavoriteMovie = (movieId) => {
    dispatch(removeFavoriteMovie({ user, movieId }));
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="text-center">
          <Spinner
            animation="border"
            variant="warning"
            size="lg"
            className="mb-3"
          />
          <p className="text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <Card className="bg-dark text-white border-warning shadow-lg">
      {/* Header */}
      <Card.Header className="bg-warning text-dark text-center py-4 border-0">
        <h2 className="mb-0 fw-bold">
          👤 {user.Username.charAt(0).toUpperCase() + user.Username.slice(1)}
        </h2>
        <small className="text-dark opacity-75">User Profile</small>
      </Card.Header>

      <Card.Body className="p-4">
        {/* User Information */}
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item className="bg-transparent border-secondary text-white px-0 py-3">
            <Row>
              <Col sm={4}>
                <strong className="text-warning">Username:</strong>
              </Col>
              <Col sm={8}>
                <span className="text-light">
                  {user.Username.charAt(0).toUpperCase() +
                    user.Username.slice(1)}
                </span>
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item className="bg-transparent border-secondary text-white px-0 py-3">
            <Row>
              <Col sm={4}>
                <strong className="text-warning">Birthday:</strong>
              </Col>
              <Col sm={8}>
                <span className="text-light">{formattedBirthday}</span>
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item className="bg-transparent border-secondary text-white px-0 py-3">
            <Row>
              <Col sm={4}>
                <strong className="text-warning">Email:</strong>
              </Col>
              <Col sm={8}>
                <span className="text-light">{user.Email}</span>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>

        {/* Favorite Movies Section */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4 className="text-warning mb-0">🎬 Favorite Movies</h4>
            <Badge bg="warning" text="dark" className="fs-6">
              {favoriteMovies.length}
            </Badge>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {favoriteMovies.length === 0 ? (
            <Alert variant="secondary" className="text-center">
              <div className="py-3">
                <h5 className="text-muted">No favorite movies yet</h5>
                <p className="text-muted mb-0">
                  Start exploring and add some movies to your favorites!
                </p>
              </div>
            </Alert>
          ) : (
            <div
              className="border border-secondary rounded p-3"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {favoriteMovies.map((movie) => (
                <Card
                  key={movie.title}
                  className="bg-secondary text-white border-0 mb-2"
                >
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col xs={8}>
                        <h6 className="mb-1 text-white fw-semibold">
                          {movie.title}
                        </h6>
                        {movie.ReleaseDate && (
                          <small className="text-warning">
                            Released: {movie.ReleaseDate.slice(0, 4)}
                          </small>
                        )}
                      </Col>
                      <Col xs={4} className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => onDeleteFavoriteMovie(movie.id)}
                          className="fw-medium"
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card.Body>

      {/* Footer Actions */}
      <Card.Footer className="bg-transparent border-warning p-4">
        <Row className="g-3">
          <Col md={6}>
            <Button
              variant="outline-danger"
              onClick={handleDeleteClick}
              className="w-100 fw-semibold"
              size="lg"
            >
              🗑️ Delete Account
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="warning"
              onClick={() => clickUpdate(1)}
              className="w-100 fw-semibold text-dark"
              size="lg"
            >
              ✏️ Edit Profile
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default ProfileView;
