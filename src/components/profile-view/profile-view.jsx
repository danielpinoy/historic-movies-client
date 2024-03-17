import { Button, Card } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Alert } from "react-bootstrap";
import { deleteUser, removeFavoriteMovie } from "../../asyncThunk/userAsyncThunks";
export const ProfileView = ({ clickUpdate, movies, token }) => {
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
                <div className="loadingData">
                    <Alert key="dark" variant="dark">
                        <Spinner animation="border" variant="dark" size="sm" />
                        Loading...
                    </Alert>
                </div>
            );
        } else if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }
        return (
            <>
                <Card>
                    <Card.Body>
                        <ListGroup>
                            <ListGroup.Item>
                                <Card.Title>Profile</Card.Title>
                                <h4>
                                    {user.Username.charAt(0).toUpperCase() + user.Username.slice(1)}
                                </h4>
                            </ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>
                                <strong>Birthday:</strong> {formattedBirthday}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Email:</strong>: {user.Email}
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex flex-column">
                                <h4>Favorite Movies:</h4>
                                {error && <Alert variant="danger">{error}</Alert>}

                                {favoriteMovies.map((movie) => {
                                    return (
                                        <div key={movie.title} className="d-flex">
                                            <h5>{movie.title}</h5>

                                            <Button
                                                size="sm"
                                                onClick={() => onDeleteFavoriteMovie(movie.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    );
                                })}
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between">
                                <Button onClick={handleDeleteClick} className="btn btn-danger">
                                    Delete
                                </Button>

                                <Button
                                    onClick={() => {
                                        clickUpdate(1);
                                    }}>
                                    Edit
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </>
        );
    };
    return <div>{loadingUser()}</div>;
};
