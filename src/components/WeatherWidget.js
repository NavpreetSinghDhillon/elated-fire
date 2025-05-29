import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  WiDaySunny,
  WiRain,
  WiCloudy,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherWidget = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your actual API key

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Fetch current weather
        const currentResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
        );

        // Fetch forecast
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
        );

        setWeatherData(currentResponse.data);
        setForecastData(forecastResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, API_KEY]);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return <WiDaySunny size={40} />;
      case "Rain":
        return <WiRain size={40} />;
      case "Clouds":
        return <WiCloudy size={40} />;
      case "Snow":
        return <WiSnow size={40} />;
      case "Thunderstorm":
        return <WiThunderstorm size={40} />;
      case "Mist":
      case "Fog":
      case "Haze":
        return <WiFog size={40} />;
      default:
        return <WiDaySunny size={40} />;
    }
  };

  const prepareForecastChartData = () => {
    if (!forecastData) return null;

    // Group forecasts by day
    const dailyForecasts = {};
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // Get average temp for each day
    const dates = Object.keys(dailyForecasts).slice(0, 7);
    const temps = dates.map((date) => {
      const dayForecasts = dailyForecasts[date];
      const avgTemp =
        dayForecasts.reduce((sum, forecast) => sum + forecast.main.temp, 0) /
        dayForecasts.length;
      return Math.round(avgTemp);
    });

    return {
      labels: dates,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temps,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
          fill: false,
        },
      ],
    };
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!weatherData) return <Typography>No weather data available</Typography>;

  const chartData = prepareForecastChartData();

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Weather in {weatherData.name}, {weatherData.sys.country}
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        {getWeatherIcon(weatherData.weather[0].main)}
        <Typography variant="h4" sx={{ ml: 2 }}>
          {Math.round(weatherData.main.temp)}°C
        </Typography>
        <Box sx={{ ml: 2 }}>
          <Typography>{weatherData.weather[0].description}</Typography>
          <Typography variant="body2">
            Feels like: {Math.round(weatherData.main.feels_like)}°C
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <Typography>Humidity: {weatherData.main.humidity}%</Typography>
          <Typography>Pressure: {weatherData.main.pressure} hPa</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Wind: {weatherData.wind.speed} m/s</Typography>
          <Typography>
            Visibility: {weatherData.visibility / 1000} km
          </Typography>
        </Grid>
      </Grid>

      {chartData && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            7-Day Temperature Forecast
          </Typography>
          <Box sx={{ height: "200px" }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default WeatherWidget;
