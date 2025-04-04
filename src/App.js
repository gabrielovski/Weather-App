import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import SearchBar from "./components/SearchBar";
import { Analytics } from "@vercel/analytics/react";
import LocationPrompt from "./components/LocationPrompt";

const WeatherCard = lazy(() => import("./components/WeatherCard"));
const NotFoundCard = lazy(() => import("./components/NotFoundCard"));
const HourlyForecastCard = lazy(() =>
  import("./components/HourlyForecastCard")
);

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
  precipitation: {
    probability: 0,
    amount: 0,
  },
};

function App() {
  const [state, setState] = useState({
    weatherData: INITIAL_WEATHER,
    error: false,
    isLoading: true,
    hasLoadedData: false,
    isWaitingPermission: false,
    hourlyForecast: [],
  });

  const fetchData = useCallback(async (lat, lon, providedState = "") => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    if (!apiKey) return;

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      // Primeiro, se não tiver estado fornecido, busca o estado via geocoding reverso
      let state = providedState;
      if (!state) {
        const reverseGeocodingResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`,
          { signal }
        );
        if (reverseGeocodingResponse.ok) {
          const [locationData] = await reverseGeocodingResponse.json();
          state = locationData.state || "";
        }
      }

      const [weatherData, forecastData] = await Promise.all([
        fetch(
          `${apiBaseUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`,
          { signal }
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br&cnt=8`,
          { signal }
        ),
      ]);

      if (!weatherData.ok || !forecastData.ok) throw new Error();

      const [weather, forecast] = await Promise.all([
        weatherData.json(),
        forecastData.json(),
      ]);

      const {
        weather: [{ icon, description }],
        main: { temp, humidity, feels_like, temp_min, temp_max },
        wind: { speed },
        name,
        sys: { country, sunrise, sunset },
      } = weather;

      setState((prev) => ({
        ...prev,
        weatherData: {
          city: `${name}, ${state ? state + ", " : ""}${country}`
            .replace(/\s+/g, " ")
            .trim(),
          temperature: Math.round(temp),
          humidity,
          windSpeed: Math.round(speed * 3.6),
          icon,
          description:
            description.charAt(0).toUpperCase() + description.slice(1),
          feelsLike: Math.round(feels_like),
          tempMin: Math.round(temp_min),
          tempMax: Math.round(temp_max),
          sunrise,
          sunset,
          precipitation: {
            probability: Math.round((weather.rain?.["1h"] || 0) > 0 ? 100 : 0),
            amount: Math.round((weather.rain?.["1h"] || 0) * 10) / 10,
          },
        },
        hourlyForecast: forecast.list,
        error: false,
        isLoading: false,
        hasLoadedData: true,
      }));

      document.title = `Clima em ${name} | ${Math.round(temp)}°C`;
      document
        .querySelector("link[rel='icon']")
        ?.setAttribute("href", `https://openweathermap.org/img/wn/${icon}.png`);
    } catch (err) {
      if (!signal.aborted) {
        setState((prev) => ({ ...prev, error: true, isLoading: false }));
        document.title = "Localização não encontrada | Weather App";
      }
    }

    return () => controller.abort();
  }, []);

  const handleSearch = useCallback(
    async (query) => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const geocodingUrl = process.env.REACT_APP_GEOCODING_API_URL;

      try {
        setState((prev) => ({ ...prev, error: false, isLoading: true }));

        const response = await fetch(
          `${geocodingUrl}?q=${query}&limit=5&appid=${apiKey}` // Aumentado o limite para 5
        );

        if (!response.ok) throw new Error();

        const data = await response.json();

        if (data.length === 0) throw new Error();

        // Tenta encontrar uma correspondência mais precisa
        const bestMatch =
          data.find((location) =>
            location.name.toLowerCase().includes(query.toLowerCase())
          ) || data[0];

        const { lat, lon, state } = bestMatch;
        await fetchData(lat, lon, state);
      } catch (err) {
        setState((prev) => ({ ...prev, error: true, isLoading: false }));
        document.title = "Localização não encontrada | Weather App";
      }
    },
    [fetchData]
  );

  useEffect(() => {
    if (!state.hasLoadedData) {
      let isMounted = true;

      if (navigator.geolocation) {
        setState((prev) => ({ ...prev, isWaitingPermission: true }));

        const timeoutId = setTimeout(() => {
          if (isMounted && !state.hasLoadedData) {
            setState((prev) => ({ ...prev, isWaitingPermission: false }));
            handleSearch(DEFAULT_CITY);
          }
        }, 5000);

        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude: lat, longitude: lon } }) => {
            if (isMounted) {
              setState((prev) => ({ ...prev, isWaitingPermission: false }));
              clearTimeout(timeoutId);
              fetchData(lat, lon);
            }
          },
          () => {
            if (isMounted && !state.hasLoadedData) {
              setState((prev) => ({ ...prev, isWaitingPermission: false }));
              clearTimeout(timeoutId);
              handleSearch(DEFAULT_CITY);
            }
          }
        );

        return () => {
          isMounted = false;
          clearTimeout(timeoutId);
        };
      } else {
        handleSearch(DEFAULT_CITY);
      }
    }
  }, [fetchData, handleSearch, state.hasLoadedData]);

  return (
    <div className="weather-app-container" style={{ paddingTop: "60px" }}>
      <SearchBar onSearch={handleSearch} />
      {state.isWaitingPermission ? (
        <LocationPrompt />
      ) : state.isLoading ? (
        <div style={{ color: "white" }}>Carregando...</div>
      ) : (
        <Suspense
          fallback={<div style={{ color: "white" }}>Carregando...</div>}>
          {state.error ? (
            <NotFoundCard />
          ) : (
            <>
              <WeatherCard {...state.weatherData} />
              {state.hourlyForecast.length > 0 && (
                <HourlyForecastCard hourlyData={state.hourlyForecast} />
              )}
            </>
          )}
        </Suspense>
      )}
      <Analytics />
    </div>
  );
}

export default App;
