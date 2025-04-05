import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsCache = useRef({});
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (suggestionsCache.current[query]) {
      setSuggestions(suggestionsCache.current[query]);
      return;
    }

    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const geocodingUrl = process.env.REACT_APP_GEOCODING_API_URL;

    try {
      const controller = new AbortController();
      const response = await fetch(
        `${geocodingUrl}?q=${query}&limit=5&appid=${apiKey}`,
        { signal: controller.signal }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();
      suggestionsCache.current[query] = data;
      setSuggestions(data);
    } catch (err) {
      setSuggestions([]);
    }
  }, []);

  const debouncedFetch = useMemo(() => {
    let timeout;
    return (query) => {
      clearTimeout(timeout);
      return new Promise((resolve) => {
        timeout = setTimeout(() => resolve(fetchSuggestions(query)), 300);
      });
    };
  }, [fetchSuggestions]);

  const handleChange = useCallback(
    async (e) => {
      const value = e.target.value;
      setLocation(value);
      if (value.length >= 3) {
        await debouncedFetch(value);
      } else {
        setSuggestions([]);
      }
    },
    [debouncedFetch]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedLocation = location.trim();
      if (trimmedLocation) {
        onSearch(trimmedLocation);
        setLocation("");
        setShowSuggestions(false);
      }
    },
    [location, onSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      const locationName = `${suggestion.name}, ${suggestion.country}`;
      onSearch(locationName);
      setLocation("");
      setShowSuggestions(false);
    },
    [onSearch]
  );

  return (
    <div id="search" ref={searchRef}>
      <form id="searchForm" onSubmit={handleSubmit}>
        <input
          type="search"
          id="searchInput"
          placeholder="Digite a localização"
          value={location}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          aria-label="Campo de busca de localização"
        />
        <button type="submit" id="searchButton" aria-label="Botão de busca">
          <img src="assets/search-icon.svg" alt="Ícone de busca" />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.lat}-${suggestion.lon}-${index}`}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
              role="button"
              tabIndex={0}>
              <img
                src="assets/location-icon.svg"
                alt=""
                style={{ width: "16px", height: "16px" }}
              />
              <div className="suggestion-info">
                <span className="suggestion-city">{suggestion.name}</span>
                <span className="suggestion-country">
                  {suggestion.state ? `${suggestion.state}, ` : ""}
                  {suggestion.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default React.memo(SearchBar);
