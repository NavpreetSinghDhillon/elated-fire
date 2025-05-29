import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
} from "@mui/material";
import WeatherWidget from "./components/WeatherWidget";
import NewsWidget from "./components/NewsWidget";
import FinanceWidget from "./components/FinanceWidget";
import "./App.css";

function App() {
  const [location, setLocation] = useState("London");
  const [stockSymbol, setStockSymbol] = useState("AAPL");
  const [newsCategory, setNewsCategory] = useState("technology");

  return (
    <Container maxWidth="xl" className="App">
      <Typography
        variant="h3"
        gutterBottom
        sx={{ mt: 3, mb: 4, fontWeight: "bold", color: "#2c3e50" }}
      >
        Comprehensive Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Controls Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location for Weather"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Stock Symbol (e.g., AAPL)"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="News Category"
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                >
                  {[
                    "technology",
                    "business",
                    "sports",
                    "health",
                    "entertainment",
                    "science",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Weather Widget */}
        <Grid item xs={12} md={6} lg={4}>
          <WeatherWidget location={location} />
        </Grid>

        {/* Finance Widget */}
        <Grid item xs={12} md={6} lg={4}>
          <FinanceWidget symbol={stockSymbol} />
        </Grid>

        {/* News Widget */}
        <Grid item xs={12} lg={4}>
          <NewsWidget category={newsCategory} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
