import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { getAllMovies } from '../../api-helpers/api-helpers';
import MovieItem from './MovieItem';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box margin={"auto"} marginTop={4}>
      <Typography variant="h4" padding={2} textAlign={"center"}>
        All Movies
      </Typography>
      <Box
        width={"100%"}
        margin={"auto"}
        marginTop={5}
        display={"flex"}
        justifyContent={"center"}
        flexWrap={"wrap"}
      >
        {movies &&
          movies.map((movie, index) => (
            <MovieItem
              key={index}
              id={movie.id}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              title={movie.title}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Movies;
