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
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import MovieGallery from "./MovieGalleryPage/MovieGallery.jsx";

export const MainView = () => {
  // State management
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken ?? null);
  const [isEditingProfile, setUserEdit] = useState(null);

  // Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { movies, loading, error } = useSelector((state) => state.movies);

  // Effects
  useEffect(() => {
    // Only fetch once when component mounts
    if (storedUser && storedToken) {
      dispatch(getMovies());
    }
  }, []);

  // Event handlers
  const handleLogout = () => dispatch(logout());

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

  return (
    <BrowserRouter>
      <div className="bg-dark min-vh-100">
        <div fluid className="">
          <Routes>
            {/* PUBLIC ROUTES - No ProtectedRoute needed */}
            <Route
              path="/signup"
              element={storedUser ? <Navigate to="/" /> : <SignupView />}
            />
            <Route
              path="/login"
              element={storedUser ? <Navigate to="/" /> : <LoginView />}
            />

            {/* PROTECTED ROUTES - Wrapped with ProtectedRoute */}

            {/* Homepage Route - Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Movies Gallery Route - */}
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <MovieGallery
                    movies={movies}
                    loading={loading}
                    error={error}
                  />
                </ProtectedRoute>
              }
            />

            {/* Profile Routes - Protected */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />

            {/* Change Password Route - Protected */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                      <ChangePasswordView />
                    </Col>
                  </Row>
                </ProtectedRoute>
              }
            />

            {/* Movie Detail Route - Protected */}
            <Route
              path="/Movies/:movieId"
              element={
                <ProtectedRoute>
                  {movies.length === 0 ? (
                    <LoadingComponent />
                  ) : (
                    <MovieView
                      movies={movies}
                      handleReset={() => {}} // No longer need search term reset
                    />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Catch-all route - Redirect to login if not authenticated, home if authenticated */}
            <Route
              path="*"
              element={
                storedUser ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
