export const GET_MOVIES_REQUEST = "GET_MOVIES_REQUEST",
    GET_MOVIES_SUCCESS = "GET_MOVIES_SUCCESS",
    GET_MOVIES_FAILURE = "GET_MOVIES_FAILURE";

const storedToken = localStorage.getItem("token");

export const getMovies = () => async (dispatch) => {
    dispatch({ type: GET_MOVIES_REQUEST });

    const timeoutId = setTimeout(() => {
        dispatch({
            type: GET_MOVIES_FAILURE,
            error: "The request took too long. Please try again later.",
        });
    }, 10000);
    // dadas
    try {
        const response = await fetch("https://history-movie-api.onrender.com/Movies", {
            headers: { Authorization: `Bearer ${storedToken}` },
        });

        clearTimeout(timeoutId);

        const movieData = await response.json();

        if (movieData) {
            const historyMovieApi = movieData.map((data) => {
                return {
                    id: data._id,
                    title: data.Title,
                    description: data.Description,
                    image: data.Image,
                    director: data.Director,
                    actor: data.Actors,
                    genre: data.Genre,
                };
            });
            dispatch({ type: GET_MOVIES_SUCCESS, movies: historyMovieApi });
        }
    } catch (error) {
        dispatch({ type: GET_MOVIES_FAILURE, movies: "Network Problem. Please try again later." });

        console.log(error, "error");
    }
};
