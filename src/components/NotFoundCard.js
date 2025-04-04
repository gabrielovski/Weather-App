import React from "react";
import "../styles/not-found-card.css";

const NotFoundCard = () => {
  return (
    <div className="not-found-card">
      <img
        src="assets/not-found.svg"
        alt="Localização não encontrada"
        className="not-found-icon"
      />
      <h2 className="not-found-title">Localização não encontrada!</h2>
      <p className="not-found-message">
        Por favor, verifique o nome da cidade e tente novamente.
      </p>
    </div>
  );
};

export default NotFoundCard;
