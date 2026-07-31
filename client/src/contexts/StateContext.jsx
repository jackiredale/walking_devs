import React, { createContext, useContext, useEffect, useState } from "react";
import { discoverByHorrorSubcategory } from "../utils/horrorSubcategories";
import loader from "../assets/loader.gif";

const Context = createContext();

// StateContext.jsx
// Shared state for: trending list + genre/sort filtering, search, and movie detail/credits.
// Sections below are independent-ish — search doesn't depend on movie detail state, etc.
// A few things (error, apiUrl, apiKey, baseImageUrl) are shared across all sections, not owned by just one.

export const StateContext = ({ children }) => {
  
  //  Shared across all sections 
  const [error, setError] = useState("");
  const baseImageUrl = "https://image.tmdb.org/t/p/original";
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
  const [query, setQuery] = useState("");

  //  Browse / Trending / Genre filter 
  const [data, setData] = useState([]);
  const [genre, setGenre] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [subcategory, setSubcategory] = useState("");//create a subcat for movie cats
  const [year, setYear] = useState("");
  const [certificate, setCertificate] = useState("");

  // fetches TMDB's full genre list once, on page load

  useEffect(() => {
    fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((responseData) => setGenreList(responseData.genres || []))
      .catch(() => setError("Error fetching genres"));
  }, []);

  useEffect(() => {
    if (query || !genre) return;
    setData([]);
    fetch(
      `${apiUrl}/discover/movie?with_genres=${genre}&sort_by=${sortBy}&api_key=${apiKey}`,
    )
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch(() => setError("Error fetching movies by genre"));
  }, [genre, sortBy]);

  //This runs the cat navigation to filter the movies - see FilterDropdown.jsx
  useEffect(() => {
    if (query || !subcategory) return;
    setData([]);
    discoverByHorrorSubcategory(subcategory, { apiUrl, apiKey })
      .then((responseData) => setData(responseData))
      .catch(() => setError("Error fetching movies by subcategory"));
  }, [subcategory]);

  //This gives options to the year dropdown in the searchbar
  useEffect(() => {
  if (query || !year) return;
  setData([]);
  fetch(`${apiUrl}/discover/movie?with_genres=27&primary_release_year=${year}&sort_by=${sortBy}&api_key=${apiKey}`)
    .then((response) => response.json())
    .then((responseData) => setData(responseData))
    .catch(() => setError("Error fetching movies by year"));
  }, [year, sortBy]);

  //This gives options to the certificate dropdown in the searchbar
  useEffect(() => {
    if (query || !certificate) return;
    setData([]);
    fetch(`${apiUrl}/discover/movie?with_genres=27&certification_country=GB&certification=${certificate}&sort_by=${sortBy}&api_key=${apiKey}`)
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch(() => setError("Error fetching movies by certificate"));
  }, [certificate, sortBy]);

  // default trending list — shown when there's no active search
  const displayMovies = () => {
    setData([]);
    fetch(
      `${apiUrl}/discover/movie?with_genres=27&sort_by=popularity.desc&api_key=${apiKey}`,
    )
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch(() => setError("Error fetching trending movies:"));
  };

  // shows the trending list on page load, and again whenever the search box is cleared
  useEffect(() => {
    if (!query) {
      displayMovies();
    }
  }, [query]);

  // Search handles

  const handleInputChange = (event) => {
    const queries = event.target.value;
    setQuery(queries);
  };

  const handleSubmit = () => {
    setData([]);
    fetch(`${apiUrl}/search/movie?query=${query}&api_key=${apiKey}`)
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch((error) => setError("Error searching for movies:", error));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleSubmit();
  };

  // Movie detail / credits 
  const [movie, setMovie] = useState(null);
  const [people, setPeople] = useState([]);
  const [paramId, setParamId] = useState(null);

  const handleClick = (movieId) => {
    fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((responseData) => setMovie(responseData))
      .catch(() => {
        setError("Error fetching movie details:");
        setMovie(null);
      });
  };

  const getPeople = (movieId) => {
    fetch(`${apiUrl}/movie/${movieId}/credits?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((responseData) => setPeople(responseData))
      .catch(() => setError("Error fetching movie credits:"));
  };

  function callTwoFunctions(movieId) {
    handleClick(movieId);
    getPeople(movieId);
  }

  function DisplayError() {
    callTwoFunctions(paramId);
    if (error) {
      return (
        <div className="mt-[50px] m-auto" data-testid="loader-image">
          <h1 className="text-xl text-red-800 font-extrabold">{error}</h1>
        </div>
      );
    } else
      return (
        <div className="mt-[50px] w-18 m-auto" data-testid="loader-image">
          <img
            className="w-full h-full object-cover"
            src={loader}
            alt="loader gif"
          />
          <h1 className="text-xl text-black font-extrabold">
            Make Sure You Are Connected to the Internet
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
        genre,
        setGenre,
        genreList,
        sortBy,
        setSortBy,
        subcategory,
        setSubcategory,
        year,
        setYear,
        certificate,
        setCertificate,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
