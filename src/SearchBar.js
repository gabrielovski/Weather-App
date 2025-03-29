import React, { useState } from "react";
import PropTypes from "prop-types";
import { clear } from "@testing-library/user-event/dist/clear";

/**
 * Componente de barra de pesquisa para buscar localizações
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSearch - Função de callback para busca
 */
const SearchBar = ({ onSearch }) => {
  // Estado para armazenar o valor do input
  const [location, setLocation] = useState("");

  /**
   * Função que lida com o envio do formulário
   * @param {Event} e - Evento de submit do formulário
   */

  const clearInput = () => {
    setLocation("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim() && onSearch) {
      onSearch(location);
      clearInput();
    }
  };

  /**
   * Função que lida com alterações no campo de input
   * @param {Event} e - Evento de mudança do input
   */
  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  return (
    <div id="search">
      <form id="searchForm" onSubmit={handleSubmit}>
        {/* Input para busca de localização */}
        <input
          type="search"
          id="searchInput"
          placeholder="Digite a localização"
          value={location}
          onChange={handleInputChange}
          aria-label="Campo de busca de localização"
        />

        {/* Botão de busca */}
        <button type="submit" id="searchButton" aria-label="Botão de busca">
          <img src="assets/search-icon.svg" alt="Ícone de busca" />
        </button>
      </form>
    </div>
  );
};

// Validação de props
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
