import React, { useMemo, useState } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUser,
  removeFavoriteMovie,
} from "../../../asyncThunk/userAsyncThunks";
import {
  Edit3,
  Lock,
  Trash2,
  Film,
  X,
  User,
  Eye,
  Plus,
  Mail,
  Cake,
} from "lucide-react";
import ProfileEditModal from "../profileEdit-view/profile-edit-modal";
import "./ProfileView.css";
import ChangePasswordModal from "../change-password/change-password-modal";
import NotificationToast from "../../../common/NotificationToast";
import { useToast } from "../../../hook/useToast";

const ProfileView = ({ movies, token }) => {
  const { user, loading, error } = useSelector((state) => state.user);
  const { loading: moviesLoading } = useSelector((state) => state.movies);
  const dispatch = useDispatch();

  // Shared toast hook for all modals and actions
  const { toastProps, showSuccess, showError } = useToast();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Favorite movies calculation
  const favoriteMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    return movies.filter(
      (m) =>
        user.FavoriteMovies.includes(m.id) ||
        user.FavoriteMovies.includes(m._id)
    );
  }, [movies, user.FavoriteMovies]);

  const stats = useMemo(() => {
    if (!movies || movies.length === 0 || moviesLoading) {
      return {
        avgRating: "...",
      };
    }

    if (favoriteMovies.length === 0) {
      return { avgRating: "0.0" };
    }

    const avgRating = (
      favoriteMovies.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
      favoriteMovies.length
    ).toFixed(1);

    // Top genre
    const genreCounts = {};
    favoriteMovies.forEach((movie) => {
      movie.genre?.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    return {
      avgRating,
    };
  }, [favoriteMovies, movies, moviesLoading]);

  const formattedBirthday = new Date(user.Birthday).toLocaleDateString();

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your Profile?"
    );
    if (confirmed) {
      dispatch(deleteUser({ user, token }));
    }
  };

  const onDeleteFavoriteMovie = (movieId) => {
    const movie = favoriteMovies.find((m) => m.id === movieId);
    const movieTitle = movie ? movie.title : "Movie";

    dispatch(removeFavoriteMovie({ user, movieId }))
      .unwrap()
      .then(() => {
        console.log("Delete successful, showing toast");
        showSuccess(`"${movieTitle}" removed from favorites`);
      })
      .catch((error) => {
        console.log("Delete failed:", error);
        showError("Failed to remove movie from favorites");
      });
  };

  const handleRemoveAllFavorites = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove ALL favorite movies?"
    );
    if (confirmed) {
      const movieCount = favoriteMovies.length;

      // Remove all movies
      favoriteMovies.forEach((movie) => {
        dispatch(removeFavoriteMovie({ user, movieId: movie.id }));
      });

      // Show success toast
      showSuccess(`Removed ${movieCount} movies from favorites`);
    }
  };

  const getUserInitial = () => {
    return user.Username ? user.Username.charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-content">
          <Spinner
            animation="border"
            variant="warning"
            size="lg"
            className="mb-3"
          />
          <p className="text-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  // Movie Collection Loading Component
  const MovieCollectionLoader = () => (
    <div className="movies-grid-container">
      <div className="movie-collection-loading">
        <div className="text-center py-5">
          <Spinner
            animation="border"
            variant="warning"
            size="lg"
            className="mb-3"
          />
          <h5 className="text-warning">Loading your movies...</h5>
          <p className="text-light">Fetching your favorite collection</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Shared toast component for all actions */}
      <NotificationToast {...toastProps} />

      <div className="compact-profile-container">
        {/* Left Sidebar - Profile Info */}
        <div className="profile-sidebar">
          <div className="profile-info">
            <h1 className="profile-title">
              <User size={18} />
              Profile
            </h1>

            <div className="avatar">{getUserInitial()}</div>

            <h2 className="user-name">
              {user.Username.charAt(0).toUpperCase() + user.Username.slice(1)}
            </h2>

            <div className="user-details">
              <div className="detail-item">
                <span className="detail-label">
                  <Mail size={14} className="me-1" />
                  Email
                </span>
                <div className="detail-value">{user.Email}</div>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <Cake size={14} className="me-1" />
                  Birthday
                </span>
                <div className="detail-value">{formattedBirthday}</div>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">
                    {moviesLoading ? "..." : favoriteMovies.length}
                  </span>
                  <span className="stat-label">Movies</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.avgRating}</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Button
              className="btn-profile-primary"
              onClick={() => setShowEditModal(true)}
            >
              <Edit3 size={16} />
              Edit Profile
            </Button>
            <Button
              className="btn-profile-secondary"
              onClick={() => setShowPasswordModal(true)}
            >
              <Lock size={16} />
              Change Password
            </Button>
          </div>
        </div>

        {/* Right Side - Movie Collection */}
        <div className="movie-collection">
          <div className="collection-header">
            <h3 className="collection-title">
              <Film size={18} />
              Movie Collection
            </h3>
            <div className="collection-actions">
              {!moviesLoading && favoriteMovies.length > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleRemoveAllFavorites}
                  className="btn-small"
                >
                  <Trash2 size={14} />
                  Remove All
                </Button>
              )}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => (window.location.href = "/movies")}
                className="btn-small"
              >
                <Eye size={14} />
                View All
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {/* Show loading state only for movie collection */}
          {moviesLoading || !movies || movies.length === 0 ? (
            <MovieCollectionLoader />
          ) : (
            <>
              <div className="movies-grid-container">
                {favoriteMovies.length === 0 ? (
                  <div className="empty-state">
                    <Film size={48} className="empty-icon" />
                    <h4>No favorite movies yet</h4>
                    <p>
                      Start exploring and add some movies to your favorites!
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => (window.location.href = "/movies")}
                    >
                      <Plus size={16} className="me-2" />
                      Browse Movies
                    </Button>
                  </div>
                ) : (
                  <div className="movies-grid-profile">
                    {favoriteMovies.map((movie) => (
                      <div key={movie.id} className="movie-card">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="movie-image"
                        />
                        <div className="movie-rating">
                          {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => onDeleteFavoriteMovie(movie.id)}
                          title={`Remove ${movie.title}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="profile-footer">
            <Button
              variant="outline-danger"
              onClick={handleDeleteClick}
              className="btn-delete"
            >
              <Trash2 size={16} className="me-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        token={token}
      />

      {/* Change Password Modal - Pass toast functions as props */}
      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        token={token}
        showSuccess={showSuccess}
        showError={showError}
      />
    </>
  );
};

export default ProfileView;
