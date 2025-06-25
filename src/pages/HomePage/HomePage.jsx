import HeroSection from "./sections/HeroSection";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const { movies, loading, error } = useSelector((state) => state.movies);

  return (
    <>
      <HeroSection movies={movies} />
    </>
  );
};

export default HomePage;
