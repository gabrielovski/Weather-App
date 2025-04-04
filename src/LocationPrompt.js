import React from "react";
import "./styles/location-prompt.css";

const LocationPrompt = () => (
  <div className="location-prompt">
    <div className="location-prompt-content">
      <img
        src="assets/location-icon.svg"
        alt="Localização"
        id="location-icon"
      />
      <h2>Localização</h2>
      <p>Permita o acesso à localização para ver o clima da sua região.</p>
      <small>
        Se não permitir em 5 segundos, mostraremos o clima de Fortaleza.
      </small>
    </div>
  </div>
);

export default LocationPrompt;
