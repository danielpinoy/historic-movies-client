import { Button, Card, Col, Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Alert } from "react-bootstrap";
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

  const loadingUser = () => {
    if (loading) {
      return (
        <div className="spinner-container">
          <div className="spinner-content">
            <Spinner animation="border" variant="primary" />
            <p className="text-hierarchy-body">Loading...</p>
          </div>
        </div>
      );
    } else if (error) {
      return (
        <Alert variant="danger" className="text-hierarchy-body">
          {error}
        </Alert>
      );
    }

    return (
      <Card className="profile-card shadow-lg border-0">
        <div className="profile-background"></div>
        <Card.Body style={{ padding: "2rem" }}>
          <Card.Title className="text-hierarchy-page-title mb-4 text-center">
            👤 User Profile
          </Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item className="border-0 px-0 py-3">
              <strong className="text-hierarchy-label d-block">Username</strong>
              <span className="text-hierarchy-body">
                {user.Username.charAt(0).toUpperCase() + user.Username.slice(1)}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="border-0 px-0 py-3">
              <strong className="text-hierarchy-label d-block">Birthday</strong>
              <span className="text-hierarchy-body">{formattedBirthday}</span>
            </ListGroup.Item>
            <ListGroup.Item className="border-0 px-0 py-3">
              <strong className="text-hierarchy-label d-block">Email</strong>
              <span className="text-hierarchy-body">{user.Email}</span>
            </ListGroup.Item>
            <ListGroup.Item className="border-0 px-0 py-3">
              <h4 className="text-hierarchy-section-header">
                🎬 Favorite Movies
              </h4>
              {error && (
                <Alert variant="danger" className="text-hierarchy-body">
                  {error}
                </Alert>
              )}
              {favoriteMovies.length === 0 ? (
                <p className="text-hierarchy-body text-muted">
                  No favorite movies yet.
                </p>
              ) : (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {favoriteMovies.map((movie) => (
                    <Row
                      key={movie.title}
                      className="mb-3 p-2 rounded"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <Col xs={9}>
                        <span className="text-hierarchy-body fw-medium">
                          {movie.title}
                        </span>
                        {movie.ReleaseDate && (
                          <small className="text-hierarchy-small d-block">
                            {movie.ReleaseDate.slice(0, 4)}
                          </small>
                        )}
                      </Col>
                      <Col xs={3} className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDeleteFavoriteMovie(movie.id)}
                          style={{ fontSize: "0.75rem" }}
                        >
                          Remove
                        </button>
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        <Card.Footer
          className="bg-light border-0"
          style={{ padding: "1.5rem" }}
        >
          <Row className="g-2">
            <Col>
              <Button
                variant="danger"
                onClick={handleDeleteClick}
                className="w-100"
              >
                Delete Account
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                onClick={() => clickUpdate(1)}
                className="w-100"
              >
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    );
  };

  return <div>{loadingUser()}</div>;
};

export default ProfileView;
