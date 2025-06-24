import HeroSection from "./sections/HeroSection";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const { movies, loading, error } = useSelector((state) => state.movies);

  <>
    <HeroSection movies={movies} />
  </>;
};

export default HomePage;
