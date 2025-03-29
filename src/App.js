import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import "./style.css";

function App() {
  const [weatherData, setWeatherData] = useState({
    city: "",
    temperature: "",
    humidity: "",
    windSpeed: "",
    icon: "",
  });

  const fetchWeatherByCoords = (latitude, longitude) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    if (!apiKey) {
      console.error(
        "A chave da API não foi encontrada. Verifique o arquivo .env."
      );
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=pt_br`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do clima");
        }
        return response.json();
      })
      .then((data) => {
        const weatherIcon = data.weather[0].icon;
        const cityName = `${data.name}, ${data.sys.country}`;
        const temperature = Math.round(data.main.temp);

        setWeatherData({
          city: cityName,
          temperature,
          humidity: data.main.humidity,
          windSpeed: (data.wind.speed * 3.6).toFixed(2),
          icon: weatherIcon,
        });

        // Atualiza o título e o favicon
        updateTitleAndFavicon(cityName, temperature, weatherIcon);
      })
      .catch((error) => {
        console.error("Erro na chamada da API:", error);
      });
  };

  const fetchWeatherByCity = (city) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    if (!apiKey) {
      console.error(
        "A chave da API não foi encontrada. Verifique o arquivo .env."
      );
      return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do clima");
        }
        return response.json();
      })
      .then((data) => {
        const weatherIcon = data.weather[0].icon;
        const cityName = `${data.name}, ${data.sys.country}`;
        const temperature = Math.round(data.main.temp);

        setWeatherData({
          city: cityName,
          temperature,
          humidity: data.main.humidity,
          windSpeed: (data.wind.speed * 3.6).toFixed(2),
          icon: weatherIcon,
        });

        // Atualiza o título e o favicon
        updateTitleAndFavicon(cityName, temperature, weatherIcon);
      })
      .catch((error) => {
        console.error("Erro na chamada da API:", error);
      });
  };

  const updateTitleAndFavicon = (city, temperature, icon) => {
    // Atualiza o título da página
    document.title = `Clima em ${city} - ${temperature}°C | Weather App`;

    // Atualiza o favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = `https://openweathermap.org/img/wn/${icon}.png`;
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
          fetchWeatherByCity("Fortaleza");
        }
      );
    } else {
      console.error("Geolocalização não é suportada pelo navegador.");
      fetchWeatherByCity("Fortaleza");
    }
  }, []);

  return (
    <div className="weather-app-container">
      <SearchBar onSearch={fetchWeatherByCity} />
      <WeatherCard
        city={weatherData.city}
        temperature={weatherData.temperature}
        humidity={weatherData.humidity}
        windSpeed={weatherData.windSpeed}
        icon={weatherData.icon}
      />
    </div>
  );
}

export default App;
