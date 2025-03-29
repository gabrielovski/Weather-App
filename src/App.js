import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";
import "./style.css";

function App() {
  // Estado para armazenar os dados do clima
  const [weatherData, setWeatherData] = useState({
    city: "",
    temperature: "",
    humidity: "",
    windSpeed: "",
    icon: "", // Novo campo para o código do ícone
  });

  // Função para buscar o clima com base na localização
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
        setWeatherData({
          city: `${data.name}, ${data.sys.country}`,
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: (data.wind.speed * 3.6).toFixed(2),
          icon: data.weather[0].icon, // Adicionando o código do ícone
        });
      })
      .catch((error) => {
        console.error("Erro na chamada da API:", error);
      });
  };

  // Função para buscar o clima com base no nome da cidade
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
        setWeatherData({
          city: `${data.name}, ${data.sys.country}`,
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: (data.wind.speed * 3.6).toFixed(2),
          icon: data.weather[0].icon, // Adicionando o código do ícone
        });
      })
      .catch((error) => {
        console.error("Erro na chamada da API:", error);
      });
  };

  // useEffect para solicitar a localização do usuário ao carregar o site
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
          // Caso o usuário não permita a localização, busca o clima de Fortaleza
          fetchWeatherByCity("Fortaleza");
        }
      );
    } else {
      console.error("Geolocalização não é suportada pelo navegador.");
      // Caso a geolocalização não seja suportada, busca o clima de Fortaleza
      fetchWeatherByCity("Fortaleza");
    }
  }, []);

  return (
    <div className="weather-app-container">
      {/* Componente de busca */}
      <SearchBar onSearch={fetchWeatherByCity} />

      {/* Componente que exibe as informações do clima */}
      <WeatherCard
        city={weatherData.city}
        temperature={weatherData.temperature}
        humidity={weatherData.humidity}
        windSpeed={weatherData.windSpeed}
        icon={weatherData.icon} // Passando o código do ícone para o WeatherCard
      />
    </div>
  );
}

export default App;
