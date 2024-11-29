import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MovieItem from './Movies/MovieItem';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { getAllMovies } from '../api-helpers/api-helpers';
const HomePage = () => {
    const [movies,setMovies]=useState([]);
    useEffect(()=>{
        getAllMovies()
        .then((data)=>setMovies(data.movies))
        .catch(err=>console.log(err))
    },[])
    console.log(movies);
    
    return (
        <Box
            width="100%"
            height="100%"
            margin="auto"
            marginTop={2}
            sx={{
                padding: { xs: 2, sm: 3, md: 4 }, // Padding adjusts based on screen size
                maxWidth: '1200px', // Max width for larger screens
            }}
        >
            <Box
                margin="auto"
                width="100%"
                height={{ xs: '30vh', sm: '40vh' }} // Responsive height for different screen sizes
                padding={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <img
                    src="https://i.ytimg.com/vi/r_W6mXqzJNU/maxresdefault.jpg"
                    alt="Spider Man"
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Box>

            <Box padding={{ xs: 3, sm: 5 }} margin="auto">
                <Typography variant="h4" textAlign="center">
                    Latest Release
                </Typography>
            </Box>

            <Box
                display="flex"
                width="100%"
                justifyContent="center"
                flexWrap="wrap"
                gap={3}
                sx={{ marginBottom: 3 }}
            >
                {movies &&movies
                .slice(0,4)
                .map((movie,index) => (
                    <MovieItem id={movie.id} title={movie.title} posterUrl = {movie.posterUrl} releaseDate={movie.releaseDate} key={index} />
                ))}
            </Box>
            <Box display={'flex'} padding={5} margin={'auto'}>
                <Button
                    component={Link}
                    to="/movies"
                    variant="outlined"
                    sx={{ margin: "auto", color: "#2b2d42" }}
                >
                    View All Movies
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
