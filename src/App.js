import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import { Analytics } from "@vercel/analytics/react";

const DEFAULT_CITY = "Fortaleza";
const initialWeatherState = {
  city: "",
  temperature: 0,
  humidity: 0,
  windSpeed: 0,
  icon: "",
};

function App() {
  const [weatherData, setWeatherData] = useState(initialWeatherState);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const processWeatherData = useCallback((data) => {
    const {
      weather: [{ icon }],
      main: { temp, humidity },
      wind: { speed },
      name,
      sys: { country },
    } = data;

    setWeatherData({
      city: `${name}, ${country}`,
      temperature: Math.round(temp),
      humidity,
      windSpeed: Math.round(speed * 3.6),
      icon,
    });

    document.title = `Clima em ${name} | ${Math.round(temp)}°C`;
    const favicon = document.querySelector("link[rel='icon']");
    favicon?.setAttribute(
      "href",
      `https://openweathermap.org/img/wn/${icon}.png?${Date.now()}`
    );
  }, []);

  const fetchWeather = useCallback(
    async (params) => {
      if (!apiKey) return console.error("API key não encontrada");

      try {
        const response = await fetch(
          `${apiBaseUrl}?${new URLSearchParams({
            ...params,
            units: "metric",
            appid: apiKey,
            lang: "pt_br",
          })}`
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        processWeatherData(data);
      } catch {
        console.error("Erro ao buscar dados do clima");
      }
    },
    [apiKey, apiBaseUrl, processWeatherData]
  );

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        fetchWeather({ lat: latitude, lon: longitude }),
      () => fetchWeather({ q: DEFAULT_CITY })
    );
  }, [fetchWeather]);

  return (
    <div className="weather-app-container">
      <SearchBar onSearch={(city) => fetchWeather({ q: city })} />
      <WeatherCard {...weatherData} />
      <Analytics />
    </div>
  );
}

export default App;
