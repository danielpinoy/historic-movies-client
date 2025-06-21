import Card from "react-bootstrap/Card";
import "../../../App.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${encodeURIComponent(movie.id)}`}
      className="remove-decoration"
    >
      <Card
        className="h-100 shadow-sm border-0"
        style={{ transition: "all 0.3s ease" }}
      >
        <div style={{ position: "relative", overflow: "hidden" }}>
          <Card.Img
            src={movie.image}
            alt={movie.title}
            style={{
              height: "400px",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
              padding: "2rem 1rem 1rem",
              color: "white",
            }}
          >
            <Card.Title className="text-hierarchy-movie-title text-white mb-0">
              {movie.title}
            </Card.Title>
            {movie.ReleaseDate && (
              <small className="text-hierarchy-small text-light">
                {movie.ReleaseDate.slice(0, 4)}
              </small>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

MovieCard.prototypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default MovieCard;
