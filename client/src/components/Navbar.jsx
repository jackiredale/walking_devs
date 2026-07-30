import React from 'react';
// import logo from '../assets/logo.png'; might come back to later
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

  const { user, setUser } = useSession();

  //handles login function
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem('authToken');
  setUser({});
  navigate('/login');
  };

  return (
    <div className="NavBar" data-testid="navbar">

      <div className='Header'>
      <Link to={"/"} className="LogoLink" data-testid="logo-link">
      <h1>Archive of Shadows</h1>
      <p>by the walking devs</p>
        {/* <img src={logo} alt="logo icon" data-testid="logo-img" /> */}
      </Link>

       <nav className='TopNav'>
              <Link to="/">Films</Link>
              <Link to="/watchlist">Watchlist</Link>
              {user?.id ? (
                <>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
                </>
                    ) : (
                          <>
         <Link to="/login">Login/Signup</Link>
          </>
)}
      </nav>
      </div>

<div className="SearchBar--wrapper">
  <form onSubmit={handleFormSubmit} className="SearchBar" data-testid="search-bar">
  <div className="field field-term">
    <label htmlFor="search-input">Search term</label>
    <input
      id="search-input"
      type="text"
      placeholder="What do you want to watch?"
      value={query}
      onChange={handleInputChange}
      className="search-input"
      data-testid="search-input"
    />
  </div>

  <div className="field">
    <label htmlFor="year">Year</label>
    <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
      <option value="">Year</option>
    </select>
  </div>

  <div className="field">
    <label htmlFor="genre">Genre</label>
    <select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)}>
      <option value="">Genre</option>
      {genreList?.map((g) => (
        <option key={g.id} value={g.id}>{g.name}</option>
      ))}
    </select>
  </div>

  <div className="field">
    <label htmlFor="rating">Rating</label>
    <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
      <option value="">Rating</option>
      <option value="7">7+</option>
      <option value="8">8+</option>
      <option value="9">9+</option>
    </select>
  </div>

  <div className="field">
    <label htmlFor="sort">Sort by</label>
    <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="popularity.desc">Popularity</option>
      <option value="vote_average.desc">Rating</option>
      <option value="release_date.desc">Newest</option>
    </select>
  </div>

  <button type="submit">Search →</button>
</form>
      </div>
    </div>
  );
};

export default Navbar;