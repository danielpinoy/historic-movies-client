import {
    ADD_FAVORITE_MOVIE_REQUEST,
    ADD_FAVORITE_MOVIE_SUCCESS,
    ADD_FAVORITE_MOVIE_FAILURE,
    DELETE_FAVORITE_MOVIE_REQUEST,
    DELETE_FAVORITE_MOVIE_SUCCESS,
    DELETE_FAVORITE_MOVIE_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    EDIT_USER_REQUEST,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILURE,
    LOG_OUT,
    DELETE_USER,
    SIGN_UP,
} from "../actions/userActions";
const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: storedUser ? storedUser : null,
};

const getRequestState = () => ({
    loading: true,
    error: null,
});

const getSuccessState = (state, action) => ({
    loading: false,
    user: action.user,
});

const getFailureState = (state, action) => ({
    ...state,
    loading: false,
    error: action.user,
});

// MULTI STATE ACTION
const asyncUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case ADD_FAVORITE_MOVIE_REQUEST:
            return getRequestState();

        case LOGIN_SUCCESS:
        case ADD_FAVORITE_MOVIE_SUCCESS:
            return getSuccessState(state, action);

        case LOGIN_FAILURE:
        case ADD_FAVORITE_MOVIE_FAILURE:
        case DELETE_FAVORITE_MOVIE_FAILURE:
        case EDIT_USER_FAILURE:
            return getFailureState(state, action);

        // USER DATA NEEDS TO BE PASSED IN ORDER TO NOT GET UNDEFINED ERROR
        case DELETE_FAVORITE_MOVIE_REQUEST:
        case EDIT_USER_REQUEST:
            return {
                loading: true,
                error: null,
                user: action.user,
            };
        case DELETE_FAVORITE_MOVIE_SUCCESS:
        case EDIT_USER_SUCCESS:
            return {
                loading: false,
                user: action.user,
            };

        default:
            return state;
    }
};

// NON MULTI STATE ACTION
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_UP:
            return action.user;
        case LOG_OUT:
            return null;

        case DELETE_USER:
            return null;
        default:
            return state;
    }
};

export { userReducer, asyncUserReducer };
