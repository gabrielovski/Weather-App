import React from "react";
import PropTypes from "prop-types";

const WeatherCard = ({ city, temperature, humidity, windSpeed, icon }) => (
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
      />
      <h2 id="temperature">{temperature}ºC</h2>
    </div>

    <div className="weather-details">
      <div id="umidade-infos">
        <img
          src="assets/water-icon.svg"
          className="img-infos"
          alt="Ícone de umidade"
        />
        <p className="infos" id="umidade">
          {humidity}%<br />
          Umidade
        </p>
      </div>

      <div id="wind-infos">
        <img
          src="assets/wind-icon.svg"
          className="img-infos"
          alt="Ícone de vento"
        />
        <p className="infos-wind" id="wind-speed">
          {windSpeed} km/h
          <br />
          Vento
        </p>
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
};

export default WeatherCard;
