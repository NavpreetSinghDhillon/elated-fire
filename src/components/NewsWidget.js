import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from "@mui/material";
import {
  Business,
  Sports,
  HealthAndSafety,
  Computer,
  Movie,
} from "@mui/icons-material";

const NewsWidget = ({ category }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "c93a2a220d704423adafc5c419a43882";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=5&country=us&apiKey=${API_KEY}`
        );
        setNews(response.data.articles);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, API_KEY]);

  const getCategoryIcon = () => {
    switch (category) {
      case "business":
        return <Business fontSize="large" />;
      case "sports":
        return <Sports fontSize="large" />;
      case "health":
        return <HealthAndSafety fontSize="large" />;
      case "technology":
        return <Computer fontSize="large" />;
      case "entertainment":
        return <Movie fontSize="large" />;
      default:
        return <Business fontSize="large" />;
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Box display="flex" alignItems="center" mb={2}>
        {getCategoryIcon()}
        <Typography variant="h6" sx={{ ml: 2 }}>
          {category.charAt(0).toUpperCase() + category.slice(1)} News
        </Typography>
      </Box>

      <List>
        {news.map((article, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Link
                    href={article.url}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    {article.title}
                  </Link>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {article.source.name}
                    </Typography>
                    {` — ${article.description?.substring(0, 100)}...`}
                  </>
                }
              />
            </ListItem>
            {index < news.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default NewsWidget;
