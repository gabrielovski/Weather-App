import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import { Analytics } from "@vercel/analytics/react";
import "./style.css";

// Constantes
const DEFAULT_CITY = "Fortaleza";

const initialWeatherState = {
  city: "",
  temperature: "",
  humidity: "",
  windSpeed: "",
  icon: "",
};

function App() {
  const [weatherData, setWeatherData] = useState(initialWeatherState);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const handleApiError = (error) => {
    console.error("Erro na chamada da API:", error);
    // Aqui você poderia adicionar um estado para mostrar mensagens de erro ao usuário
  };

  const updateTitleAndFavicon = useCallback((city, temperature, icon) => {
    document.title = `Clima em ${city} | ${temperature}°C`;
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = `https://openweathermap.org/img/wn/${icon}.png?${Date.now()}`;
    }
  }, []);

  const processWeatherData = useCallback(
    (data) => {
      const weatherIcon = data.weather[0].icon;
      const cityName = `${data.name}, ${data.sys.country}`;
      const temperature = Math.round(data.main.temp);
      const windSpeed = Math.round(data.wind.speed * 3.6);

      const newWeatherData = {
        city: cityName,
        temperature,
        humidity: data.main.humidity,
        windSpeed,
        icon: weatherIcon,
      };

      setWeatherData(newWeatherData);
      updateTitleAndFavicon(cityName, temperature, weatherIcon);
    },
    [updateTitleAndFavicon]
  );

  const fetchWeather = useCallback(
    async (params) => {
      if (!apiKey) {
        console.error(
          "A chave da API não foi encontrada. Verifique o arquivo .env."
        );
        return;
      }

      try {
        const queryParams = new URLSearchParams({
          ...params,
          units: "metric",
          appid: apiKey,
          lang: "pt_br",
        });

        const response = await fetch(`${apiBaseUrl}?${queryParams}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do clima");

        const data = await response.json();
        processWeatherData(data);
      } catch (error) {
        handleApiError(error);
      }
    },
    [apiKey, apiBaseUrl, processWeatherData]
  );

  const fetchWeatherByCity = useCallback(
    (city) => {
      fetchWeather({ q: city });
    },
    [fetchWeather]
  );

  const fetchWeatherByCoords = useCallback(
    (latitude, longitude) => {
      fetchWeather({ lat: latitude, lon: longitude });
    },
    [fetchWeather]
  );

  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    };

    const handleError = (error) => {
      console.error("Erro ao obter localização do usuário:", error);
      fetchWeatherByCity(DEFAULT_CITY);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.error("Geolocalização não é suportada pelo navegador.");
      fetchWeatherByCity(DEFAULT_CITY);
    }
  }, [fetchWeatherByCity, fetchWeatherByCoords]);

  return (
    <div className="weather-app-container">
      <SearchBar onSearch={fetchWeatherByCity} />
      <WeatherCard {...weatherData} />
      <Analytics />
    </div>
  );
}

export default App;
