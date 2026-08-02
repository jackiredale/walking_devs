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
  const [query, setQuery] = useState("");

  //  Browse / Trending / Genre filter
  const [data, setData] = useState([]);
  const [genre, setGenre] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [subcategory, setSubcategory] = useState(""); //create a subcat for movie cats
  const [decade, setDecade] = useState("");
  const [rating, setRating] = useState("");
  const [seededMovies, setSeededMovies] = useState([]);

  // fetches TMDB's full genre list once, on page load

  useEffect(() => {
    fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((responseData) => setGenreList(responseData.genres || []))
      .catch(() => setError("Error fetching genres"));
  }, []);

  //This runs the cat navigation to filter the movies - see FilterDropdown.jsx
  useEffect(() => {
    if (query || !subcategory) return;
    setData([]);
    discoverByHorrorSubcategory(subcategory, {
      apiUrl, apiKey, rating, decade, sortBy,
    })
      .then((responseData) => setData(responseData))
      .catch(() => setError("Error fetching movies by subcategory"));
  }, [subcategory, rating, decade, sortBy]);

  //this runs decade and rating together instead of overwriting each other
  useEffect(() => {
    if (query || subcategory) return; // let search or the category tabs take priority
    if (!decade && !rating) return;
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
    fetch(`${apiUrl}/discover/movie?${params}`)
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch(() => setError("Error fetching filtered movies"));
  }, [decade, rating, sortBy, subcategory, query]);

  // default trending list — shown when there's no active search
  const displayMovies = () => {
    setData([]);
    fetch(
      `${apiUrl}/discover/movie?with_genres=27&sort_by=popularity.desc&api_key=${apiKey}`
    )
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch(() => setError("Error fetching trending movies:"));
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
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (subcategory) params.set("subgenre", subcategory);
    if (decade) params.set("decade", decade);
    if (rating) params.set("minRating", rating);

    mockSeededMovies(params)
      .then((responseData) => setSeededMovies(responseData.movies))
      .catch(() => setError("Error fetching seeded movies"));
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
  const handleSubmit = () => {
    if (!query) return; // do nothing if the search box is empty
    setData([]);
    fetch(`${apiUrl}/search/movie?query=${query}&api_key=${apiKey}`)
      .then((response) => response.json())
      .then((responseData) => {
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
      })
      .catch((error) => setError("Error searching for movies:", error));
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
