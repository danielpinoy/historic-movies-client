import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={`/movies/${encodeURIComponent(movie.id)}`}
      className="text-decoration-none"
    >
      <Card
        className="h-100 bg-dark text-white border-warning shadow-lg overflow-hidden"
        style={{
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.classList.add("border-warning", "shadow-lg");
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div className="position-relative overflow-hidden">
          <Card.Img
            src={movie.image}
            alt={movie.title}
            className="card-img-top"
            style={{
              height: "400px",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          />

          {/* Gradient overlay with movie info */}
          <div
            className="position-absolute bottom-0 start-0 end-0 p-3"
            style={{
              background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
              paddingTop: "3rem",
            }}
          >
            <Card.Title className="text-white fw-bold mb-1 h5">
              {movie.title}
            </Card.Title>
            {movie.ReleaseDate && (
              <small className="text-warning fw-medium">
                {movie.ReleaseDate.slice(0, 4)}
              </small>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    ReleaseDate: PropTypes.string,
  }).isRequired,
};

export default MovieCard;
