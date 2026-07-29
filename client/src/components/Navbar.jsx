import React from 'react';
import { BiSearch } from 'react-icons/bi';
import menu from '../assets/menu.png';
import logo from '../assets/logo.png';
import { useStateContext } from '../context/StateContext';
import { Link, Form } from 'react-router-dom';

function Navbar() {
  const { handleFormSubmit, query, handleInputChange } = useStateContext();

  return (
    <div className="navbar" data-testid="navbar">
      <Link to={"/"} className="logo-link" data-testid="logo-link">
        <img src={logo} alt="logo icon" data-testid="logo-img" />
      </Link>
      <Form onSubmit={handleFormSubmit} className="search-bar" data-testid="search-bar">
        <input
          type="text"
          placeholder="What do you want to watch?"
          value={query}
          onChange={handleInputChange}
          className="search-input"
          data-testid="search-input"
        />
        <BiSearch className="search-icon" data-testid="search-icon" />
      </Form>
      <div className="menu-icon" data-testid="menu-icon">
        <img src={menu} alt="menu icon" />
      </div>
    </div>
  );
}

export default Navbar;