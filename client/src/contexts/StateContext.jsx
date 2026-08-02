import React, { createContext, useContext, useEffect, useState } from "react";
import { discoverByHorrorSubcategory } from "../utils/horrorSubcategories";
import loader from "../assets/loader.gif";
import seededMoviesData from "../mock/seededMovies.json";

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
  // this is a helper function to fetch JSON data and handle errors
  const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
  };

  const [query, setQuery] = useState("");

  //  Browse / Trending / Genre filter
  const [data, setData] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [subcategory, setSubcategory] = useState(""); //create a subcat for movie cats
  const [decade, setDecade] = useState("");
  const [rating, setRating] = useState("");
  const [seededMovies, setSeededMovies] = useState([]);

  //This runs the cat navigation to filter the movies - see FilterDropdown.jsx
  useEffect(() => {
    if (query || !subcategory) return;
    const fetchBySubcategory = async () => {
      setData([]);
      try {
        const responseData = await discoverByHorrorSubcategory(subcategory, {
          apiUrl, apiKey, rating, decade, sortBy,
        });
        setData(responseData);
      } catch {
        setError("Error fetching movies by subcategory");
      }
    };
    fetchBySubcategory();
  }, [subcategory, rating, decade, sortBy]);

  //this runs decade and rating together instead of overwriting each other
  useEffect(() => {
    if (query || subcategory) return; // let search or the category tabs take priority
    if (!decade && !rating) return;

    const fetchFilteredMovies = async () => {
      setData([]);
      const params = new URLSearchParams({
        api_key: apiKey,
        sort_by: sortBy,
        with_genres: "27",
      });
      if (decade) {
        params.set("primary_release_date.gte", `${decade}-01-01`);
        params.set("primary_release_date.lte", `${Number(decade) + 9}-12-31`);
      }
      if (rating) {
        params.set("vote_average.gte", rating);
      }
      try {
        const responseData = await fetchJson(`${apiUrl}/discover/movie?${params}`);
        setData(responseData);
      } catch {
        setError("Error fetching filtered movies");
      }
    };

    fetchFilteredMovies();
  }, [decade, rating, sortBy, subcategory, query]);

  // default trending list — shown when there's no active search
  const displayMovies = async () => {
  setData([]);
  try {
    const responseData = await fetchJson(
      `${apiUrl}/discover/movie?with_genres=27&sort_by=popularity.desc&api_key=${apiKey}`
    );
    setData(responseData);
  } catch {
    setError("Error fetching trending movies:");
  }
  };

  //  mock seeded movies for testing without hitting the API
  const mockSeededMovies = (params) => {
    const search = params.get("search");
    const subgenre = params.get("subgenre");
    const decade = params.get("decade");
    const minRating = params.get("minRating");

    const filtered = seededMoviesData.filter((movie) => {
      const matchesSearch =
        !search || movie.title.toLowerCase().includes(search.toLowerCase());
      const matchesSubgenre =
        !subgenre ||
        movie.categories.some(
          (c) => c.toLowerCase() === subgenre.toLowerCase()
        );
      const matchesDecade =
        !decade ||
        (movie.releaseYear >= Number(decade) &&
          movie.releaseYear <= Number(decade) + 9);
      const matchesRating =
        !minRating || movie.averageRating >= Number(minRating);
      return matchesSearch && matchesSubgenre && matchesDecade && matchesRating;
    });

    return Promise.resolve({ movies: filtered });
  };

  useEffect(() => {
    const fetchSeeded = async () => {
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (subcategory) params.set("subgenre", subcategory);
      if (decade) params.set("decade", decade);
      if (rating) params.set("minRating", rating);

      try {
        const responseData = await mockSeededMovies(params);
        setSeededMovies(responseData.movies);
      } catch {
        setError("Error fetching seeded movies");
      }
    };
    fetchSeeded();
  }, [query, subcategory, decade, rating, sortBy]);

  // shows the trending list on page load, and again whenever the search box is cleared
  useEffect(() => {
    if (!query) {
      displayMovies();
    }
  }, [query]);

  //updates query whenever you type something in the search box
  const handleInputChange = (event) => {
    const queries = event.target.value;
    setQuery(queries);
  };
  // runs the search using whatever's in query right now
  // modified to filter genre ids down to a specific decade
  const handleSubmit = async () => {
    if (!query) return; // do nothing if the search box is empty
    setData([]);
    try {
      const responseData = await fetchJson(
        `${apiUrl}/search/movie?query=${query}&api_key=${apiKey}`
      );
      const filtered = (responseData.results || []).filter((movie) => {
        const isHorror = movie.genre_ids?.includes(27);
        const releaseYear = movie.release_date
          ? Number(movie.release_date.slice(0, 4))
          : null;
        const matchesDecade =
          !decade ||
          (releaseYear &&
            releaseYear >= Number(decade) &&
            releaseYear <= Number(decade) + 9);
        return isHorror && matchesDecade;
      });
      setData({ ...responseData, results: filtered });
    } catch {
      setError("Error searching for movies:");
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    handleSubmit();
  };

  // this resets all filters when the user clicks the logo
  // to go back to the home page or the all button in the navbar
  const resetFilters = () => {
    setQuery("");
    setSubcategory("");
    setDecade("");
    setRating("");
    setSortBy("popularity.desc");
    displayMovies(); // this will reset the data to the default trending list
  };

  // Movie detail / credits
  const [movie, setMovie] = useState(null);
  const [people, setPeople] = useState([]);

  const handleClick = async (movieId) => {
    try {
      const responseData = await fetchJson(
        `${apiUrl}/movie/${movieId}?api_key=${apiKey}`
      );
      setMovie(responseData);
    } catch {
      setError("Error fetching movie details:");
      setMovie(null);
    }
  };

  const getPeople = async (movieId) => {
    try {
      const responseData = await fetchJson(
        `${apiUrl}/movie/${movieId}/credits?api_key=${apiKey}`
      );
      setPeople(responseData);
    } catch {
      setError("Error fetching movie credits:");
    }
  };

  function callTwoFunctions(movieId) {
    handleClick(movieId);
    getPeople(movieId);
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
        movie,
        people,
        callTwoFunctions,
        handleFormSubmit,
        sortBy,
        setSortBy,
        subcategory,
        setSubcategory,
        decade,
        setDecade,
        rating,
        setRating,
        resetFilters,
        seededMovies,
        setSeededMovies,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
