import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ProfileEditView } from "../profileEdit-view/profileEdit-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";
import { getMovies } from "../../actions/movieActions";
import { Alert } from "react-bootstrap";

export const MainView = () => {
    // Retrieve user information from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Retrieve token from local storage or set it to null if not present
    const storedToken = localStorage.getItem("token");

    // eslint-disable-next-line
    const [token, setToken] = useState(storedToken ? storedToken : null);

    const [isEditingProfile, setUserEdit] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch]);

    // Get user information and movie data from Redux store
    const user = useSelector((state) => state.user);
    const { movies, loading, error } = useSelector((state) => state.movies);

    // Map movies to MovieCard components
    const updatedMovie = movies.map((movie) => (
        <Col key={movie.id} md={3} className="mb-4">
            <MovieCard movie={movie} />
        </Col>
    ));
    return (
        <BrowserRouter>
            <NavigationBar
                user={user}
                loggedOut={() => {
                    dispatch(logout());
                }}
            />
            <Row>
                <Routes>
                    <Route
                        path="/signup"
                        element={
                            storedUser ? (
                                <Navigate to="/" />
                            ) : (
                                <Col md={5}>
                                    <SignupView />
                                </Col>
                            )
                        }
                    />

                    {/* Login view */}

                    <Route
                        path="/login"
                        element={
                            <>
                                {storedUser ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={4}>
                                        <LoginView />
                                    </Col>
                                )}
                            </>
                        }
                    />

                    {/* User profile view */}

                    <Route
                        path="/users"
                        element={
                            !storedUser ? (
                                <Navigate to="/login" replace />
                            ) : (
                                <Col md={12} className="d-flex justify-content-center">
                                    {!isEditingProfile ? (
                                        <ProfileView
                                            movies={movies}
                                            token={token}
                                            clickUpdate={(num) => setUserEdit(num)}
                                        />
                                    ) : (
                                        <ProfileEditView
                                            token={storedToken}
                                            clickUpdate={(num) => setUserEdit(num)}
                                        />
                                    )}
                                </Col>
                            )
                        }
                    />

                    {/* Movie details view */}

                    <Route
                        path="/Movies/:movieId"
                        element={
                            !storedUser ? (
                                <Navigate to="/login" replace />
                            ) : movies.length === 0 ? (
                                <Col>The list is empty!</Col>
                            ) : (
                                <Col md={12}>
                                    <MovieView movies={movies} />
                                </Col>
                            )
                        }
                    />

                    {/* Home view */}

                    <Route
                        path="/"
                        element={
                            !storedUser ? (
                                <Navigate to="/login" replace />
                            ) : loading ? (
                                <Alert key="dark" variant="dark">
                                    Loading...
                                </Alert>
                            ) : movies.length === 0 ? (
                                <div className="loadingData">
                                    <Alert key="dark" variant="danger">
                                        No Movies to Show
                                    </Alert>
                                </div>
                            ) : (
                                <>
                                    {error && <Alert variant="danger">{error}</Alert>}

                                    {updatedMovie}
                                </>
                            )
                        }
                    />
                </Routes>
            </Row>
        </BrowserRouter>
    );
};
