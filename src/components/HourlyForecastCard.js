import React, { useMemo } from "react";
import PropTypes from "prop-types";

const HourlyForecastCard = ({ hourlyData }) => {
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const hour = date.getHours().toString().padStart(2, "0") + "h";

    // Se for hoje, retorna apenas a hora
    if (date.toDateString() === today.toDateString()) {
      return hour;
    }

    // Se for amanhã, retorna "Amanhã" + hora
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã ${hour}`;
    }

    // Para outros dias, retorna o dia/mês + hora
    return `${date.getDate()}/${date.getMonth() + 1} ${hour}`;
  };

  const formattedData = useMemo(
    () =>
      hourlyData.map((hour) => ({
        ...hour,
        formattedTime: formatDateTime(hour.dt),
        roundedTemp: Math.round(hour.main.temp),
      })),
    [hourlyData]
  );

  return (
    <div className="hourly-forecast-card">
      <h3 className="hourly-title">Próximas horas</h3>
      <div className="hourly-list">
        {formattedData.map((hour, index) => (
          <div key={index} className="hourly-item">
            <span className="hour">{hour.formattedTime}</span>
            <img
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
              alt={hour.weather[0].description}
              className="hourly-icon"
              loading="lazy"
            />
            <span className="hourly-temp">{hour.roundedTemp}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};

HourlyForecastCard.propTypes = {
  hourlyData: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number.isRequired,
      main: PropTypes.shape({
        temp: PropTypes.number.isRequired,
      }).isRequired,
      weather: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default HourlyForecastCard;
