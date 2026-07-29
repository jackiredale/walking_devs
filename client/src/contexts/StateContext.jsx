import React, { createContext, useContext } from 'react';

const Context = createContext();

const StateContext = ({ children }) => {
  const baseImageUrl = 'https://image.tmdb.org/t/p/original';
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;

  return (
    <Context.Provider
      value={{
        baseImageUrl,
        apiUrl,
        apiKey
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);