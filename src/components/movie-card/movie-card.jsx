import React from "react";
import Card from "react-bootstrap/Card";
import "./movie-card.scss";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movies/${encodeURIComponent(movie.id)}`} className="remove-decoration">
            <Card className="hover h-100">
                <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Img src={movie.image} alt={movie.title} />
                </Card.Body>
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
