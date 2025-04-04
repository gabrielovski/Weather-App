import React from "react";
import PropTypes from "prop-types";

const formatTime = (timestamp) =>
  new Date(timestamp * 1000).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const WeatherCard = ({
  city,
  temperature,
  humidity,
  windSpeed,
  icon,
  description,
  feelsLike,
  tempMin,
  tempMax,
  sunrise,
  sunset,
}) => (
  <div id="card">
    <div className="location-container">
      <img
        src="assets/location-icon.svg"
        id="location-icon"
        alt="Ícone de localização"
      />
      <h4 id="city">{city}</h4>
    </div>

    <div className="temperature-container">
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        id="weather-icon"
        alt="Ícone do clima"
        loading="lazy"
      />
      <h2 id="temperature">{temperature}°C</h2>
      <p id="description">{description}</p>
    </div>

    <div className="secondary-info">
      <p id="feels-like">Sensação térmica: {feelsLike}°C</p>
      <p id="temp-range">
        Min: {tempMin}°C / Máx: {tempMax}°C
      </p>
    </div>

    <div className="weather-details">
      <div className="weather-detail-item">
        <img
          src="assets/water-icon.svg"
          className="img-infos"
          alt="Ícone de umidade"
        />
        <div className="detail-text">
          <span className="detail-value">{humidity}%</span>
          <span className="detail-label">Umidade</span>
        </div>
      </div>

      <div className="weather-detail-item">
        <img
          src="assets/wind-icon.svg"
          className="img-infos"
          alt="Ícone de vento"
        />
        <div className="detail-text">
          <span className="detail-value">{windSpeed} km/h</span>
          <span className="detail-label">Vento</span>
        </div>
      </div>
    </div>

    <div className="sun-times">
      <div className="sun-time-item">
        <img
          src="assets/sunrise-icon.svg"
          alt="Nascer do sol"
          className="img-infos"
        />
        <span className="sun-time-text">{formatTime(sunrise)}</span>
      </div>
      <div className="sun-time-item">
        <img
          src="assets/sunset-icon.svg"
          alt="Pôr do sol"
          className="img-infos"
        />
        <span className="sun-time-text">{formatTime(sunset)}</span>
      </div>
    </div>
  </div>
);

WeatherCard.propTypes = {
  city: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  feelsLike: PropTypes.number.isRequired,
  tempMin: PropTypes.number.isRequired,
  tempMax: PropTypes.number.isRequired,
  sunrise: PropTypes.number.isRequired,
  sunset: PropTypes.number.isRequired,
};

export default React.memo(WeatherCard);
