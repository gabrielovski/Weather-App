import React, { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import DetailsModal from "./DetailsModal";

const formatTime = (timestamp) =>
  new Date(timestamp * 1000).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const WeatherCard = ({ city, temperature, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formattedTimes = useMemo(
    () => ({
      sunrise: formatTime(props.sunrise),
      sunset: formatTime(props.sunset),
    }),
    [props.sunrise, props.sunset]
  );

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
    document.body.style.overflow = !isModalOpen ? "hidden" : "unset";
  }, [isModalOpen]);

  return (
    <>
      <div id="card" onClick={toggleModal}>
        <div className="location-container">
          <img
            src="assets/location-icon.svg"
            id="location-icon"
            alt="Ícone de localização"
          />
          <h4 id="city">{city}</h4>
          <span className="update-time">Atualizado às {currentTime}</span>
        </div>

        <div className="temperature-container">
          <img
            src={`https://openweathermap.org/img/wn/${props.icon}@2x.png`}
            id="weather-icon"
            alt="Ícone do clima"
            loading="lazy"
          />
          <h2 id="temperature">{temperature}°C</h2>
          <p id="description">{props.description}</p>
        </div>

        <div className="weather-details">
          <div className="weather-detail-item">
            <img
              src="assets/rain-icon.svg"
              className="img-infos rain-icon"
              alt="Ícone de chuva"
            />
            <div className="detail-text">
              <span className="detail-value">
                {props.precipitation.probability}%
              </span>
              <span className="detail-label">Chance de chuva</span>
            </div>
          </div>

          <div className="weather-detail-item">
            <img
              src="assets/wind-icon.svg"
              className="img-infos"
              alt="Ícone de vento"
            />
            <div className="detail-text">
              <span className="detail-value">{props.windSpeed} km/h</span>
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
            <span className="sun-time-text">{formattedTimes.sunrise}</span>
          </div>
          <div className="sun-time-item">
            <img
              src="assets/sunset-icon.svg"
              alt="Pôr do sol"
              className="img-infos"
            />
            <span className="sun-time-text">{formattedTimes.sunset}</span>
          </div>
        </div>
        <div className="more-info-hint">Toque para mais informações</div>
      </div>

      <DetailsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        weatherDetails={{
          feelsLike: props.feelsLike,
          tempMin: props.tempMin,
          tempMax: props.tempMax,
          precipitation: props.precipitation,
          humidity: props.humidity,
        }}
      />
    </>
  );
};

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
  precipitation: PropTypes.shape({
    probability: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(WeatherCard);
