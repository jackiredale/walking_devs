import React from 'react';
// import logo from '../assets/logo.png'; might come back to later
import { useStateContext } from '../contexts/StateContext';
import { Link, useNavigate } from 'react-router-dom';
import FilterDropdown from "./FilterDropdown.jsx";
import { HORROR_SUBCATEGORIES } from "../utils/horrorSubcategories";

import { useSession } from '../contexts/SessionContext';

import "./Navbar.css";

function Navbar() {
  
  //pull in search rules from StateContext.jsx
  const {
    handleFormSubmit, query, handleInputChange,
    decade, setDecade,
    subcategory, setSubcategory,
    certificate, setCertificate,
    sortBy, setSortBy,
  } = useStateContext();

  // YEAR SEARCH DROPDOWN - A for loop to add options for the year ddm
  const currentYear = new Date().getFullYear();
  const currentDecade = Math.floor(currentYear / 10) * 10;
  const decades = [];
  for (let d = currentDecade; d >= 1890; d -= 10) {
    decades.push(d);
  }
  const decadeOptions = decades.map((d) => <option key={d} value={d}>{d}s</option>);

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

      <div className='Header'>
      <Link to={"/"} className="LogoLink" data-testid="logo-link">
      <h1>Archive of Shadows</h1>
      <p>by the walking devs</p>
        {/* <img src={logo} alt="logo icon" data-testid="logo-img" /> */}
      </Link>

       <nav className='TopNav'>
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
      </div>

     <FilterDropdown />

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
    <label htmlFor="decade">Decade</label>
    <select id="decade" value={decade} onChange={(e) => setDecade(e.target.value)}>
      <option value="">Decade</option>
      {decadeOptions}
    </select>
  </div>

  <div className="field">
  <label htmlFor="genre">Genre</label>
  <select id="genre" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
    <option value="">Genre</option>
    {HORROR_SUBCATEGORIES.map((label) => (
      <option key={label} value={label}>{label}</option>
    ))}
  </select>
</div>

  <div className="field">
  <label htmlFor="certificate">Certificate</label>
  <select id="certificate" value={certificate} onChange={(e) => setCertificate(e.target.value)}>
    <option value="">Certificate</option>
    <option value="PG">PG</option>
    <option value="12A">12A</option>
    <option value="15">15</option>
    <option value="18">18</option>
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