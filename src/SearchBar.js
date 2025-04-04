import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedLocation = location.trim();
      if (trimmedLocation) {
        onSearch(trimmedLocation);
        setLocation("");
      }
    },
    [location, onSearch]
  );

  return (
    <div id="search">
      <form id="searchForm" onSubmit={handleSubmit}>
        <input
          type="search"
          id="searchInput"
          placeholder="Digite a localização"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Campo de busca de localização"
        />
        <button type="submit" id="searchButton" aria-label="Botão de busca">
          <img src="assets/search-icon.svg" alt="Ícone de busca" />
        </button>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default React.memo(SearchBar);
