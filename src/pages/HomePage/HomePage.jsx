import HeroSection from "./sections/HeroSection";
import HighlightsSection from "./sections/HighlightsSection";
import NewReleasesSection from "./sections/NewReleasesSection"; // Import the new section
import { StickyNavigationBar } from "../../components/layout/navigation-bar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slice/userSlice";

const HomePage = () => {
  const { movies, loading, error } = useSelector((state) => state.movies);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  return (
    <>
      {/* Hero Section - Top of page */}
      <HeroSection movies={movies} />

      {/* Sticky Navigation */}
      <StickyNavigationBar user={user} loggedOut={handleLogout} />

      {/* Highlights Section */}
      <HighlightsSection movies={movies} />

      {/* NEW: New Releases Section */}
      <NewReleasesSection movies={movies} />

      {/* Optional: Additional content sections
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="text-warning mb-4">Featured Collections</h2>
            <p className="text-light">
              Discover more amazing historical movies in our collection.
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default HomePage;
