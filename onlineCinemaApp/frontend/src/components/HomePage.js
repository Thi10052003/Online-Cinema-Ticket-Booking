import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import MovieItem from "./Movies/MovieItem";
import { Link } from "react-router-dom";
import { getAllMovies } from "../api-helpers/api-helpers";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data.movies || []); // Handle possible undefined data
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      margin="auto"
      sx={{
        backgroundColor: "black",
        padding: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1200px",
      }}
    >
      {/* Hero Image */}
      <Box
        margin="auto"
        width="100%"
        height={{ xs: "30vh", sm: "40vh" }}
        padding={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <img
          src="https://i.ytimg.com/vi/e7RvFZ6XtkI/maxresdefault.jpg"
          alt="Spider Man"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      {/* Section Title */}
      <Box padding={{ xs: 3, sm: 5 }} margin="auto">
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
          }}
        >
          Movie Selection
        </Typography>
      </Box>

      {/* Movie Items */}
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        flexWrap="wrap"
        gap={3}
        sx={{ marginBottom: 3 }}
      >
        {loading ? (
          <CircularProgress sx={{ color: "white", marginTop: 2 }} />
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", marginTop: 2 }}>
            {error}
          </Typography>
        ) : (
          movies.slice(0, 4).map((movie) => (
            <MovieItem
              id={movie._id}
              title={movie.title}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              key={movie._id} // Use unique identifier
            />
          ))
        )}
      </Box>

      {/* View All Movies Button */}
      <Box display="flex" justifyContent="center" padding={5}>
        <Button
          component={Link}
          to="/movies"
          sx={{
            color: "white",
            borderColor: "white",
            backgroundColor: "red",
            padding: "10px 20px",
            fontSize: "16px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            transition: "all 0.3s ease",
          }}
        >
          View All Movies
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
