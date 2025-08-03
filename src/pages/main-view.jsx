// Updated src/pages/main-view.jsx
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MovieView } from "../pages/MoviesPage/index.tsx";
import {
  ProfileView,
  ProfileEditView,
  ChangePasswordView,
} from "./ProfilePage/index.tsx";
import { LoginView, SignupView } from "../pages/AuthPage/index";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMovies } from "../slice/movieSlice";
import HomePage from "./HomePage/HomePage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import MovieGallery from "./MovieGalleryPage/MovieGallery.jsx";
import Sidebar from "../components/layout/Navbar.jsx";

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

  // Loading component
  const LoadingComponent = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "60vh" }}
    >
      <div className="text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-warning mt-3">Loading Movies...</h4>
        <p className="text-light">Please wait while we fetch your content</p>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <div className="bg-dark min-vh-100">
        <Routes>
          {/* PUBLIC ROUTES - No sidebar */}
          <Route
            path="/signup"
            element={
              storedUser ? (
                <Navigate to="/" />
              ) : (
                <div className="min-vh-100">
                  <SignupView />
                </div>
              )
            }
          />
          <Route
            path="/login"
            element={
              storedUser ? (
                <Navigate to="/" />
              ) : (
                <div className="min-vh-100">
                  <LoginView />
                </div>
              )
            }
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Sidebar />
                <Routes>
                  {/* Homepage Route */}
                  <Route path="/" element={<HomePage />} />

                  {/* Movies Gallery Route */}
                  <Route
                    path="/movies"
                    element={
                      <MovieGallery
                        movies={movies}
                        loading={loading}
                        error={error}
                      />
                    }
                  />

                  {/* Profile Routes */}
                  <Route
                    path="/users"
                    element={
                      <Container className="py-2">
                        <Row className="justify-content-center">
                          <div className="py-2">
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
                        </Row>
                      </Container>
                    }
                  />

                  {/* Change Password Route */}
                  <Route
                    path="/change-password"
                    element={
                      <Container className="py-2">
                        <Row className="justify-content-center">
                          <Col lg={8} xl={6}>
                            <ChangePasswordView />
                          </Col>
                        </Row>
                      </Container>
                    }
                  />

                  {/* Movie Detail Route */}
                  <Route
                    path="/movies/:movieId"
                    element={
                      movies.length === 0 ? (
                        <Container className="py-2">
                          <LoadingComponent />
                        </Container>
                      ) : (
                        <Container className="py-2">
                          <MovieView movies={movies} handleReset={() => {}} />
                        </Container>
                      )
                    }
                  />

                  {/* Catch-all route for authenticated users */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
