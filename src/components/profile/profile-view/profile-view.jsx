import { Button, Card, Col, Row } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Alert } from "react-bootstrap";
import { deleteUser, removeFavoriteMovie } from "../../../asyncThunk/userAsyncThunks";
const ProfileView = ({ clickUpdate, movies, token }) => {
    const { user, loading, error } = useSelector((state) => state.user);
    const formattedBirthday = new Date(user.Birthday).toLocaleDateString();
    const favoriteMovies = movies.filter((m) => user.FavoriteMovies.includes(m.id));
    const dispatch = useDispatch();
    const handleDeleteClick = () => {
        const confirmed = window.confirm("Are you sure you want to delete your Profile?");
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
                        <p>Loading...</p>
                    </div>
                </div>
            );
        } else if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }
        return (
            <Card className="profile-card">
                <div className="profile-background"></div>
                <Card.Body>
                    <Card.Title className="mb-4">
                        <h2>Profile</h2>
                    </Card.Title>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <strong>Username: </strong>
                            {user.Username.charAt(0).toUpperCase() + user.Username.slice(1)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Birthday:</strong> {formattedBirthday}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Email:</strong> {user.Email}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h4>Favorite Movies:</h4>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {favoriteMovies.length === 0 ? (
                                <p>No favorite movies.</p>
                            ) : (
                                favoriteMovies.map((movie) => (
                                    <Row key={movie.title} className="mb-2">
                                        <Col xs={9}>{movie.title}</Col>
                                        <Col xs={3} className="text-right">
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => onDeleteFavoriteMovie(movie.id)}>
                                                Delete
                                            </Button>
                                        </Col>
                                    </Row>
                                ))
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col>
                            <Button variant="danger" onClick={handleDeleteClick}>
                                Delete User
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={() => clickUpdate(1)}>Edit User</Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        );
    };
    return <div>{loadingUser()}</div>;
};

export default ProfileView;
