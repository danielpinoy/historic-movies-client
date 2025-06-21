import { useState, useEffect, useMemo } from "react";
import { Form, Col, Row, Alert } from "react-bootstrap";
import { MovieCard, MovieView } from "../pages/MoviesPage/index.tsx";
// import {
//   ProfileView,
//   ProfileEditView,
//   ChangePasswordView,
// } from "./profile/index.tsx";
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

  // Render movies grid or empty state
  const renderMovies = () => {
    if (filteredMovies.length === 0) {
      return <Alert variant="light">No Movies Found</Alert>;
    }

    return filteredMovies.map((movie) => (
      <Col key={movie.id} md={3} className="mb-4">
        <MovieCard movie={movie} />
      </Col>
    ));
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} loggedOut={handleLogout} />
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

          <Route
            path="/login"
            element={storedUser ? <Navigate to="/" /> : <LoginView />}
          />

          <Route
            path="/users"
            element={
              !storedUser ? (
                <Navigate to="/login" replace />
              ) : (
                <Col md={12} className="d-flex justify-content-center">
                  <div className="profile-container">
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
                  </div>
                </Col>
              )
            }
          />

          <Route
            path="/change-password"
            element={
              !storedUser ? (
                <Navigate to="/login" replace />
              ) : (
                <Col md={12} className="d-flex justify-content-center">
                  <div className="profile-container">
                    <ChangePasswordView />
                  </div>
                </Col>
              )
            }
          />

          <Route
            path="/Movies/:movieId"
            element={
              !storedUser ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0 ? (
                <Col>The list is empty!</Col>
              ) : (
                <Col md={10}>
                  <MovieView
                    movies={movies}
                    handleReset={handleResetSearchTerm}
                  />
                </Col>
              )
            }
          />

          <Route
            path="/"
            element={
              !storedUser ? (
                <Navigate to="/login" replace />
              ) : loading ? (
                <Alert variant="dark">Loading...</Alert>
              ) : (
                <>
                  {error && (
                    <Alert variant="danger">
                      {typeof error === "string"
                        ? error
                        : "An unexpected error occurred"}
                    </Alert>
                  )}

                  <Form.Control
                    type="text"
                    placeholder="Search Movies"
                    value={searchTerm}
                    className="mt-3 mb-3"
                    onChange={handleSearch}
                    aria-label="Search movies"
                  />

                  {renderMovies()}
                </>
              )
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
