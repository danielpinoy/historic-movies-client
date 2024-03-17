import { Button, Card } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { addFavoriteMovieToUser } from "../../asyncThunk/userAsyncThunks";
import { useDispatch, useSelector } from "react-redux";
export const MovieView = ({ movies, handleReset }) => {
    const { user, loading, error } = useSelector((state) => state.user);
    const { movieId } = useParams();
    const dispatch = useDispatch();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const isMovieInFavorites = storedUser.FavoriteMovies.includes(String(movieId));
    const movie = movies.find((m) => m.id === movieId);
    const similarMovies = movies.filter(
        (m) => m.genre.Name === movie.genre.Name && m.id !== movieId
    );

    return (
        <Card>
            <Card.Body className="d-flex flex-column">
                <Card.Header as="h5">{movie.title}</Card.Header>

                <Card.Text>{movie.description}</Card.Text>
                <Card.Text>
                    <strong>Director:</strong> {movie.director.Name}
                    <br />
                    {movie.director.Bio}
                </Card.Text>

                <strong>Actors:</strong>

                <ul className="list-unstyled">
                    <div className="row">
                        {movie.actor.map((actor, index) => (
                            <div className="col-md-4 my-2" key={index}>
                                <li>{actor}</li>
                            </div>
                        ))}
                    </div>
                </ul>

                <Card.Text>
                    <strong>Genre:</strong> {movie.genre.Name}
                </Card.Text>

                <Card.Text className="list-unstyled">
                    <strong>Similar Movies:</strong>
                </Card.Text>
                <div className="row list-unstyled">
                    {similarMovies.map((movie) => (
                        <div className="col-sm-4 my-1" key={movie.id}>
                            <Link to={`/Movies/${movie.id}`}>
                                <Button variant="outline-dark" size="sm" className="width-lg">
                                    {movie.title}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
                <Card.Text className="d-flex justify-content-between">
                    <Link to={`/`}>
                        <Button
                            variant="primary"
                            style={{ cursor: "pointer" }}
                            onClick={handleReset}>
                            Close
                        </Button>
                    </Link>
                    {isMovieInFavorites ? (
                        <Button variant="secondary">Already Your Favorite</Button>
                    ) : (
                        <>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Button
                                onClick={() => {
                                    dispatch(addFavoriteMovieToUser({ userId: user._id, movieId }));
                                }}
                                variant="dark"
                                style={{ cursor: "pointer" }}
                                disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-1"
                                            variant="secondary"
                                        />
                                        Adding...
                                    </>
                                ) : (
                                    "Add To Favorite"
                                )}
                            </Button>
                        </>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};
