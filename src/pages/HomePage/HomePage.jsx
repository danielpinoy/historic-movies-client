import HeroSection from "./sections/HeroSection";
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
      <HeroSection movies={movies} />
      <StickyNavigationBar user={user} loggedOut={handleLogout} />

      {/* Add some content below to test the sticky behavior */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="text-warning mb-4">Featured Collections</h2>
            <p className="text-light">
              Discover more amazing historical movies in our collection.
            </p>
            {/* You can add more content here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
