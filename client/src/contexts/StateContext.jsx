import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import loader from "../assets/loader.gif";

const Context = createContext();

// StateContext.jsx
// Shared state for: trending list + genre/sort filtering, search, and movie detail/credits.
// Sections below are independent-ish — search doesn't depend on movie detail state, etc.
// A few things (error, apiUrl, apiKey, baseImageUrl) are shared across all sections, not owned by just one.

export const StateContext = ({ children }) => {
  const [data, setData] = useState({ results: [] });
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState(null);
  const [people, setPeople] = useState([]);
  const [error, setError] = useState("");
  const [paramId, setParamId] = useState(null);

  const [genre, setGenre] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [subcategory, setSubcategory] = useState("");
  const [decade, setDecade] = useState("");
  const [rating, setRating] = useState("");

  const baseImageUrl = "";

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;

  const formatMovie = (movie) => ({
    ...movie,
    id: movie.tmdbId,
    databaseId: movie.id,
    overview: movie.description,
    poster_path: movie.posterUrl,
    release_date: `${movie.releaseYear}-01-01`,
    vote_average: movie.averageRating,
  });

  useEffect(() => {
    setGenreList([
      { id: "Slasher", name: "Slasher" },
      { id: "Supernatural", name: "Supernatural" },
      { id: "Psychological", name: "Psychological" },
      { id: "Sci-Fi Horror", name: "Sci-Fi Horror" },
      { id: "Zombie", name: "Zombie" },
    ]);
  }, []);

  //updates query whenever you type something in the search box
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const displayMovies = async () => {
    setData({ results: [] });
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/movies');

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const responseData = await response.json();
      const formattedMovies = responseData.movies.map(formatMovie);

      setData({
        results: formattedMovies,
      });
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Error fetching movies');
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      displayMovies();
    }
  }, [query]);

  const handleSubmit = async () => {
    setData({ results: [] });
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/movies');

      if (!response.ok) {
        throw new Error('Failed to search movies');
      }

      const responseData = await response.json();
      const searchTerm = query.trim().toLowerCase();

      const filteredMovies = responseData.movies
        .filter((movie) =>
          movie.title.toLowerCase().includes(searchTerm)
        )
        .map(formatMovie);

      setData({
        results: filteredMovies,
      });
    } catch (error) {
      console.error('Error searching for movies:', error);
      setError('Error searching for movies');
    }
  };

    const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit();
  };

  const resetFilters = () => {
    setQuery("");
    setGenre("");
    setSubcategory("");
    setDecade("");
    setRating("");
    setSortBy("popularity.desc");
    displayMovies();
  };

  const handleClick = async (movieId) => {
    try {
      setError('');

      const response = await fetch(
        `${apiUrl}/movie/${movieId}?api_key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const responseData = await response.json();
      setMovie(responseData);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Error fetching movie details');
      setMovie(null);
    }
  };

  const getPeople = async (movieId) => {
    try {
      setError('');

      const response = await fetch(
        `${apiUrl}/movie/${movieId}/credits?api_key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movie credits');
      }

      const responseData = await response.json();
      setPeople(responseData);
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      setError('Error fetching movie credits');
      setPeople([]);
    }

  };

  function callTwoFunctions(movieId) {
    setParamId(movieId);
    handleClick(movieId);
    getPeople(movieId);
  }

  function DisplayError() {

    if (error) {
      return (
        <div
          className="mt-[50px] m-auto"
          data-testid="loader-image"
        >
          <h1 className="text-xl text-red-800 font-extrabold">
            {error}
          </h1>
        </div>
      );
    }

    return (
      <div
        className="mt-[50px] w-18 m-auto"
        data-testid="loader-image"
      >
        <img
          className="w-full h-full object-cover"
          src={loader}
          alt="Loading"
        />

        <h1 className="text-xl text-black font-extrabold">
          Loading movies...
        </h1>
      </div>
    );
  }

  // Exposed to the rest of the app
  return (
    <Context.Provider
      value={{
        data,
        baseImageUrl,
        setData,
        handleSubmit,
        handleInputChange,
        query,
        setQuery,
        DisplayError,
        movie,
        people,
        callTwoFunctions,
        handleFormSubmit,
        setParamId,

        paramId,
        genre,
        setGenre,
        genreList,
        sortBy,
        setSortBy,
        subcategory,
        setSubcategory,
        decade,
        setDecade,
        rating,
        setRating,
        resetFilters,
      
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);