import { useState, useEffect, useMemo } from "react";
import {
  Form,
  Col,
  Row,
  Alert,
  Container,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { MovieCard, MovieView } from "../pages/MoviesPage/index.tsx";
import {
  ProfileView,
  ProfileEditView,
  ChangePasswordView,
} from "./ProfilePage/index.tsx";
import { LoginView, SignupView } from "../pages/AuthPage/index";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "../components/layout/navigation-bar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slice/userSlice";
import { getMovies } from "../slice/movieSlice";
import HomePage from "./HomePage/HomePage.jsx";

export const MainView = () => {
  // State management
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken ?? null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingProfile, setUserEdit] = useState(null);

  // Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { movies, loading, error } = useSelector((state) => state.movies);

  // Effects
  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  // Memoized filtered movies for performance
  const filteredMovies = useMemo(
    () =>
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [movies, searchTerm]
  );

  // Event handlers
  const handleLogout = () => dispatch(logout());
  const handleResetSearchTerm = () => setSearchTerm("");
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Loading component
  const LoadingComponent = () => (
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
        <h4 className="text-warning">Loading Movies...</h4>
        <p className="text-light">Please wait while we fetch your content</p>
      </div>
    </div>
  );

  // Empty state component
  const EmptyMoviesState = () => (
    <Col xs={12}>
      <Alert variant="warning" className="text-center py-5">
        <Alert.Heading className="text-dark">🎬 No Movies Found</Alert.Heading>
        <p className="text-dark mb-0">
          {searchTerm
            ? `No movies match "${searchTerm}". Try a different search term.`
            : "No movies are currently available."}
        </p>
        {searchTerm && (
          <button
            className="btn btn-outline-dark mt-3"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </button>
        )}
      </Alert>
    </Col>
  );

  // Error component
  const ErrorComponent = ({ error }) => (
    <Col xs={12}>
      <Alert variant="danger" className="text-center py-4">
        <Alert.Heading>⚠️ Something went wrong</Alert.Heading>
        <p className="mb-0">
          {typeof error === "string" ? error : "An unexpected error occurred"}
        </p>
      </Alert>
    </Col>
  );

  return (
    <BrowserRouter>
      <div className="bg-dark min-vh-100">
        {/* <NavigationBar user={user} loggedOut={handleLogout} /> */}

        <Container fluid className="py-4">
          <Routes>
            {/* Homepage Route - Hero Section */}
            <Route
              path="/"
              element={
                !storedUser ? <Navigate to="/login" replace /> : <HomePage />
              }
            />

            {/* Signup Route */}
            <Route
              path="/signup"
              element={storedUser ? <Navigate to="/" /> : <SignupView />}
            />

            {/* Login Route */}
            <Route
              path="/login"
              element={storedUser ? <Navigate to="/" /> : <LoginView />}
            />

            {/* Movies List Route - Grid with Search */}
            <Route
              path="/movies"
              element={
                !storedUser ? (
                  <Navigate to="/login" replace />
                ) : (
                  <>
                    {/* Search bar for movies page */}
                    <Row>
                      <Col xs={12} className="mb-4">
                        <InputGroup size="lg">
                          <InputGroup.Text className="bg-warning text-dark fw-semibold">
                            🔍
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Search for movies by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-dark text-white border-warning"
                            style={{ fontSize: "1.1rem" }}
                          />
                          {searchTerm && (
                            <button
                              className="btn btn-outline-warning"
                              onClick={() => setSearchTerm("")}
                              type="button"
                            >
                              ✕
                            </button>
                          )}
                        </InputGroup>
                        {searchTerm && (
                          <small className="text-warning mt-2 d-block">
                            Showing {filteredMovies.length} result(s) for "
                            {searchTerm}"
                          </small>
                        )}
                      </Col>
                    </Row>

                    {/* Movies Grid */}
                    <Row>
                      {loading ? (
                        <Col xs={12}>
                          <LoadingComponent />
                        </Col>
                      ) : error ? (
                        <ErrorComponent error={error} />
                      ) : filteredMovies.length === 0 ? (
                        <EmptyMoviesState />
                      ) : (
                        filteredMovies.map((movie) => (
                          <Col
                            key={movie.id}
                            sm={6}
                            md={4}
                            lg={3}
                            className="mb-4"
                          >
                            <MovieCard movie={movie} />
                          </Col>
                        ))
                      )}
                    </Row>
                  </>
                )
              }
            />

            {/* Profile Routes */}
            <Route
              path="/users"
              element={
                !storedUser ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                      {!isEditingProfile ? (
                        <ProfileView
                          movies={movies}
                          token={token}
                          clickUpdate={setUserEdit}
                        />
                      ) : (
                        <ProfileEditView
                          token={storedToken}
                          clickUpdate={setUserEdit}
                        />
                      )}
                    </Col>
                  </Row>
                )
              }
            />

            {/* Change Password Route */}
            <Route
              path="/change-password"
              element={
                !storedUser ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                      <ChangePasswordView />
                    </Col>
                  </Row>
                )
              }
            />

            {/* Movie Detail Route */}
            <Route
              path="/Movies/:movieId"
              element={
                !storedUser ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <LoadingComponent />
                ) : (
                  <Row className="justify-content-center">
                    <Col lg={10} xl={8}>
                      <MovieView
                        movies={movies}
                        handleReset={handleResetSearchTerm}
                      />
                    </Col>
                  </Row>
                )
              }
            />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
};
