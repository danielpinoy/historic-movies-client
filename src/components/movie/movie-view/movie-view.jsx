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
        .filter((m) => m.id !== movieId && m.genre.some((genre) => movie.genre.includes(genre)))
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

    console.log(similarMovies);
    return (
        <Card className="bg-light">
            <Row className="g-0">
                <Col md={4}>
                    <Card.Img src={movie.image} alt={`${movie.title} Poster`} />
                </Col>
                <Col md={8}>
                    <Card.Body>
                        <Card.Title>{movie.title}</Card.Title>
                        <Card.Text>
                            <Row>
                                <Col>Date: {movie.ReleaseDate.slice(0, 4)}</Col>
                                <Col>{movie.Runtime}</Col>
                                <Col>Genre: {movie.genre.join(", ")}</Col>
                            </Row>
                            <Row>
                                <Col className="mt-3 mb-3">{movie.description}</Col>
                            </Row>
                        </Card.Text>
                        <Col>Similar Movies</Col>
                        <Row>
                            {similarMovies.map((movie) => (
                                <Col sm={4} key={movie.id} className="my-1">
                                    <Link to={`/Movies/${movie.id}`} className="movie-link">
                                        <div className="movie-title">{movie.title}</div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                        <Card.Text className="d-flex justify-content-between mt-3">
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
                                            dispatch(
                                                addFavoriteMovieToUser({
                                                    userId: user._id,
                                                    movieId,
                                                })
                                            );
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
                </Col>
            </Row>
        </Card>
    );
};

export default MovieView;
