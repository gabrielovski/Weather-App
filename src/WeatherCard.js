import React from "react";
import PropTypes from "prop-types";

/**
 * Componente que exibe as informações do clima atual
 * @param {Object} props - Propriedades do componente
 * @param {string} props.city - Nome da cidade
 * @param {number} props.temperature - Temperatura em graus Celsius
 * @param {number} props.humidity - Percentual de umidade
 * @param {number} props.windSpeed - Velocidade do vento em km/h
 * @param {string} props.icon - Código do ícone
 */

const WeatherCard = ({ city, temperature, humidity, windSpeed, icon }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // URL do ícone

  return (
    <div id="card">
      {/* Informação de localização */}
      <div className="location-container">
        <img
          src="assets/location-icon.svg"
          id="location-icon"
          alt="Ícone de localização"
        />
        <h4 id="city">{city}</h4>
      </div>

      {/* Informação de temperatura */}
      <div className="temperature-container">
        <img
          src={iconUrl} // URL do ícone do clima
          id="weather-icon"
          alt="Ícone de condição climática"
        />
        <h2 id="temperature">{temperature}ºC</h2>
      </div>

      {/* Informações adicionais: umidade e vento */}
      <div className="weather-details">
        <div id="umidade-infos">
          <img
            src="assets/water-icon.svg"
            className="img-infos"
            alt="Ícone de umidade"
          />
          <p className="infos" id="umidade">
            {humidity}%
            <br />
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
};

// Validação de props para documentação e segurança
WeatherCard.propTypes = {
  city: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  windSpeed: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
};

// Valores padrão caso as props não sejam fornecidas
WeatherCard.defaultProps = {
  city: "Localização desconhecida",
  temperature: 0,
  humidity: 0,
  windSpeed: 0,
  icon: "default-icon",
};

export default WeatherCard;
