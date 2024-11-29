import React, { useEffect, useState } from 'react';
import { AppBar, Autocomplete, Tab, TextField, Tabs, Toolbar } from '@mui/material';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import { Box } from '@mui/system';
import { getAllMovies } from '../api-helpers/api-helpers';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Header = () => {
    const [value, setValue] = useState(0);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.log(err));
    }, []);

    return (
        <AppBar position="sticky" sx={{ bgcolor: "#2b2d42" }}>
            <Toolbar>
                <Box width="20%">
                    <MovieCreationIcon />
                </Box>
                <Box width="30%" margin="auto">
                    <Autocomplete
                        freeSolo
                        options={movies && movies.map((option) => option.title)}
                        renderInput={(params) => (
                            <TextField
                                sx={{ input: { color: "white" } }}
                                variant="standard"
                                {...params}
                                placeholder="Search Movies"
                            />
                        )}
                    />
                </Box>
                <Box display="flex">
                    <Tabs
                        textColor="inherit"
                        indicatorColor="secondary"
                        value={value}
                        onChange={(e, val) => setValue(val)}
                    >
                        {/* Update Tab with component prop */}
                        <Tab component={Link} to="/movies" label="Movies" />
                        <Tab component={Link} to="/admin" label="Admin" />
                        <Tab component={Link} to="/auth" label="Login" />
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
