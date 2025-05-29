import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
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

const FinanceWidget = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "YOUR_ALPHAVANTAGE_API_KEY"; // Replace with your actual API key

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );

        if (response.data["Error Message"]) {
          throw new Error(response.data["Error Message"]);
        }

        const timeSeries = response.data["Time Series (Daily)"];
        if (!timeSeries) {
          throw new Error("No time series data available");
        }

        // Convert data to chart format
        const dates = Object.keys(timeSeries).slice(0, 30).reverse();
        const prices = dates.map((date) =>
          parseFloat(timeSeries[date]["4. close"])
        );

        setStockData({
          symbol: response.data["Meta Data"]["2. Symbol"],
          lastRefreshed: response.data["Meta Data"]["3. Last Refreshed"],
          dates,
          prices,
          currentPrice: prices[prices.length - 1],
          previousClose: prices[prices.length - 2],
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, API_KEY]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!stockData) return <Typography>No stock data available</Typography>;

  const priceChange = stockData.currentPrice - stockData.previousClose;
  const percentChange = (priceChange / stockData.previousClose) * 100;

  const chartData = {
    labels: stockData.dates,
    datasets: [
      {
        label: "Closing Price",
        data: stockData.prices,
        borderColor:
          priceChange >= 0 ? "rgb(75, 192, 192)" : "rgb(255, 99, 132)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {stockData.symbol} Stock Data
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" sx={{ mr: 2 }}>
          ${stockData.currentPrice.toFixed(2)}
        </Typography>
        <Typography
          variant="h6"
          color={priceChange >= 0 ? "success.main" : "error.main"}
        >
          {priceChange >= 0 ? "+" : ""}
          {priceChange.toFixed(2)} ({percentChange >= 0 ? "+" : ""}
          {percentChange.toFixed(2)}%)
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Previous Close: ${stockData.previousClose.toFixed(2)} | Last Updated:{" "}
        {stockData.lastRefreshed}
      </Typography>

      <Box sx={{ height: "250px" }}>
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
            scales: {
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 45,
                },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default FinanceWidget;
