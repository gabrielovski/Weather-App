import React from "react";
import PropTypes from "prop-types";

const DetailsModal = ({ isOpen, onClose, weatherDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h3>Detalhes do Clima</h3>

        <div className="modal-details">
          <div className="detail-group">
            <h4>Temperatura</h4>
            <p>Sensação térmica: {weatherDetails.feelsLike}°C</p>
            <p>Mínima: {weatherDetails.tempMin}°C</p>
            <p>Máxima: {weatherDetails.tempMax}°C</p>
          </div>

          <div className="detail-group">
            <h4>Condições</h4>
            <p>Umidade: {weatherDetails.humidity}%</p>
            <p>Chance de chuva: {weatherDetails.precipitation.probability}%</p>
            <p>Volume: {weatherDetails.precipitation.amount} mm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

DetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  weatherDetails: PropTypes.shape({
    feelsLike: PropTypes.number.isRequired,
    tempMin: PropTypes.number.isRequired,
    tempMax: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    precipitation: PropTypes.shape({
      probability: PropTypes.number.isRequired,
      amount: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DetailsModal;
