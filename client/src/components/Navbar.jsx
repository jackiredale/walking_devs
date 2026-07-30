import React from 'react';
import logo from '../assets/logo.png';
import { useStateContext } from '../contexts/StateContext';
import { Link, useNavigate } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';

import "./Navbar.css";

function Navbar() {
  
  const {
    handleFormSubmit, query, handleInputChange,
    year, setYear,
    genre, setGenre, genreList,
    rating, setRating,
    sortBy, setSortBy,
  } = useStateContext();

  const { user } = useSession();

  //handles login function
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

   const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="NavBar" data-testid="navbar">
      <Link to={"/"} className="LogoLink" data-testid="logo-link">
      <h1>Archive of Shadows</h1>
      <p>by the walking devs</p>
        {/* <img src={logo} alt="logo icon" data-testid="logo-img" /> */}
      </Link>

       <nav>
              <Link to="/">Films</Link>
              <Link to="/watchlist">Watchlist</Link>
              {token ? (
                <>
                  <Link to="/profile">Login</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login">Login/Signup</Link>
                </>
              )}
      </nav>

      <form onSubmit={handleFormSubmit} className="SearchBar" data-testid="search-bar">
        <input
          type="text"
          placeholder="What do you want to watch?"
          value={query}
          onChange={handleInputChange}
          className="search-input"
          data-testid="search-input"
        />
         <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          {/* map over a list of years here */}
        </select>

        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Genre</option>
          {genreList?.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

         <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">Rating</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
          <option value="9">9+</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="popularity.desc">Popularity</option>
          <option value="vote_average.desc">Rating</option>
          <option value="release_date.desc">Newest</option>
        </select>

        <button type="submit">Search</button>
      </form>
      
    </div>
  );
};

export default Navbar;