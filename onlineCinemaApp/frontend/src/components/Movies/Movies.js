import { Box, Typography, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import { getAllMovies } from "../../api-helpers/api-helpers";
import MovieItem from "./MovieItem";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data.movies || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies. Please try again later.");
      }
    };

    fetchMovies();
  }, []);

  return (
    <Box margin={"auto"}>
      <Typography variant="h4" padding={2} textAlign={"center"}>
        All Movies
      </Typography>

      {/* Error State */}
      {error && (
        <Box display="flex" justifyContent="center" mt={5}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Movies List */}
      <Box
        width={"100%"}
        margin={"auto"}
        marginTop={5}
        display={"flex"}
        justifyContent={"center"}
        flexWrap={"wrap"}
        gap={3} // Add spacing between items
      >
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieItem
              key={movie._id} // Use unique identifier
              id={movie._id}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              title={movie.title}
            />
          ))
        ) : !error ? (
          <Typography variant="body1" color="textSecondary">
            No movies available at the moment.
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default Movies;
