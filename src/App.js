import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import SearchBar from "./SearchBar";
import { Analytics } from "@vercel/analytics/react";
import LocationPrompt from "./LocationPrompt";

const WeatherCard = lazy(() => import("./WeatherCard"));
const NotFoundCard = lazy(() => import("./NotFoundCard"));

const DEFAULT_CITY = "Fortaleza";
const INITIAL_WEATHER = {
  city: "",
  temperature: 0,
  humidity: 0,
  windSpeed: 0,
  icon: "",
  description: "",
  feelsLike: 0,
  tempMin: 0,
  tempMax: 0,
  sunrise: 0,
  sunset: 0,
};

function App() {
  const [weatherData, setWeatherData] = useState(INITIAL_WEATHER);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [isWaitingPermission, setIsWaitingPermission] = useState(false);

  const fetchWeather = useCallback(async (params) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    if (!apiKey) return;

    try {
      setError(false);
      setIsLoading(true);

      const response = await fetch(
        `${apiBaseUrl}?${new URLSearchParams({
          ...params,
          units: "metric",
          appid: apiKey,
          lang: "pt_br",
        })}`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (!response.ok) throw new Error();

      const data = await response.json();

      const {
        weather: [{ icon, description }],
        main: { temp, humidity, feels_like, temp_min, temp_max },
        wind: { speed },
        name,
        sys: { country, sunrise, sunset },
      } = data;

      setWeatherData({
        city: `${name}, ${country}`,
        temperature: Math.round(temp),
        humidity,
        windSpeed: Math.round(speed * 3.6),
        icon,
        description: description.charAt(0).toUpperCase() + description.slice(1),
        feelsLike: Math.round(feels_like),
        tempMin: Math.round(temp_min),
        tempMax: Math.round(temp_max),
        sunrise,
        sunset,
      });

      document.title = `Clima em ${name} | ${Math.round(temp)}°C`;
      document
        .querySelector("link[rel='icon']")
        ?.setAttribute("href", `https://openweathermap.org/img/wn/${icon}.png`);
      setHasLoadedData(true);
    } catch (err) {
      setError(true);
      document.title = "Localização não encontrada | Weather App";
      document
        .querySelector("link[rel='icon']")
        ?.setAttribute("href", "favicon.ico"); // ou o caminho do seu ícone padrão
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedData) {
      let isMounted = true;

      if (navigator.geolocation) {
        setIsWaitingPermission(true);

        const timeoutId = setTimeout(() => {
          if (isMounted && !hasLoadedData) {
            setIsWaitingPermission(false);
            fetchWeather({ q: DEFAULT_CITY });
          }
        }, 5000);

        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude: lat, longitude: lon } }) => {
            if (isMounted) {
              setIsWaitingPermission(false);
              clearTimeout(timeoutId);
              fetchWeather({ lat, lon });
            }
          },
          () => {
            if (isMounted && !hasLoadedData) {
              setIsWaitingPermission(false);
              clearTimeout(timeoutId);
              fetchWeather({ q: DEFAULT_CITY });
            }
          }
        );

        return () => {
          isMounted = false;
          clearTimeout(timeoutId);
        };
      } else {
        fetchWeather({ q: DEFAULT_CITY });
      }
    }
  }, [fetchWeather, hasLoadedData]);

  return (
    <div className="weather-app-container">
      <SearchBar onSearch={(city) => fetchWeather({ q: city })} />
      {isWaitingPermission ? (
        <LocationPrompt />
      ) : isLoading ? (
        <div style={{ color: "white" }}>Carregando...</div>
      ) : (
        <Suspense
          fallback={<div style={{ color: "white" }}>Carregando...</div>}>
          {error ? <NotFoundCard /> : <WeatherCard {...weatherData} />}
        </Suspense>
      )}
      <Analytics />
    </div>
  );
}

export default App;
