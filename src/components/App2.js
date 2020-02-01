import React, {useEffect, useReducer} from 'react';

import '../App.css';
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";
const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=ee5dc2b2";
const initialState = {
    loading: true,
    movies: [],
    errorMessage: null
};
const SEARCH_MOVIES_REQUEST = "SEARCH_MOVIES_REQUEST";
const SEARCH_MOVIES_SUCCESS = "SEARCH_MOVIES_SUCCESS";
const SEARCH_MOVIES_FAILURE = "SEARCH_MOVIES_FAILURE";
const reducer = (state, action) => {
    switch (action.type) {
        case SEARCH_MOVIES_REQUEST:
            return {
                ...state,
                loading: true,
                errorMessage: null
            };
        case SEARCH_MOVIES_SUCCESS:
            return {
                ...state,
                loading: false,
                movies: action.payload
            };
        case SEARCH_MOVIES_FAILURE:
            return {
                ...state,
                loading: false,
                errorMessage: action.error
            };
        default:
            return state;
    }
};
const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        fetch(MOVIE_API_URL)
            .then(response => response.json())
            .then(jsonResponse => {
                dispatch({
                    type: SEARCH_MOVIES_SUCCESS,
                    payload: jsonResponse.Search
                });
            })
    }, []);

    const search = (searchValue)=>{
        dispatch ({
            type: SEARCH_MOVIES_REQUEST
        });
        fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=ee5dc2b2`)
            .then (response =>response.json())
            .then ((jsonResponse)=>{
                if (jsonResponse.Response ==="True") {
                    dispatch({
                        type:SEARCH_MOVIES_SUCCESS,
                        payload: jsonResponse.Search
                    });
                }else {
                    dispatch({
                        type:SEARCH_MOVIES_FAILURE,
                        error:jsonResponse.Error
                    })
                }
            })
    };

    const { movies, errorMessage, loading } = state; // state defined when reducer is used


    return (
        <div className="App">
            <Header text="HOOKED" />
            <Search search={search} />
            <p className="App-intro">Sharing a few of our favourite movies</p>
            <div className="movies">
                {loading && !errorMessage ? (
                    <span>loading... </span>
                ) : errorMessage ? (
                    <div className="errorMessage">{errorMessage}</div>
                ) : (
                    movies.map((movie, index) => (
                        <Movie key={`${index}-${movie.Title}`} movie={movie} />
                    ))
                )}
            </div>
        </div>
    );
    //
    //
};
export default App;
