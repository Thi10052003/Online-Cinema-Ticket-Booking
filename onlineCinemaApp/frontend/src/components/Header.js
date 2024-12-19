import React, { useEffect, useState } from 'react';
import { AppBar, Autocomplete, Tab, TextField, Tabs, Toolbar } from '@mui/material';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import { Box } from '@mui/system';
import { getAllMovies } from '../api-helpers/api-helpers';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const [value, setValue] = useState(0);
    const [movies, setMovies] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.log(err));
    }, []);

    // Logout function
    const logout = () => {
        dispatch(userActions.logout());
    };

    // Handle the search movie selection
    const handleMovieSearchChange = (e, val) => {
        const movie = movies.find((m) => m.title === val);
        if (movie) {
            if (isUserLoggedIn) {
                navigate(`/booking/${movie._id}`);
            }
        }
    };

    return (
        <AppBar position="sticky" sx={{ bgcolor: "#222222" }}>
            <Toolbar>
                <Box width="20%">
                    <Link to="/">
                        <MovieCreationIcon sx={{ color: "#fff", cursor: "pointer" }} />
                    </Link>
                </Box>
                <Box width="30%" margin="auto">
                    <Autocomplete
                        freeSolo
                        value={searchValue}
                        onInputChange={(e, newInputValue) => setSearchValue(newInputValue)}
                        onChange={handleMovieSearchChange}
                        options={movies && movies.map((option) => option.title)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Search Movies"
                                variant="standard"
                                sx={{
                                    input: { color: "white" },
                                    "& .MuiInput-underline:before": { borderBottomColor: "white" },
                                    "& .MuiInput-underline:hover:before": { borderBottomColor: "white" },
                                    "& .MuiInput-underline:after": { borderBottomColor: "white" },
                                    "& .MuiInputBase-root": { color: "white" },
                                    "& .MuiAutocomplete-popupIndicator": { color: "white" },
                                }}
                            />
                        )}
                    />
                </Box>

                <Box display="flex">
                    <Tabs
                        textColor="inherit"
                        indicatorColor="inherit"
                        value={value}
                        onChange={(e, val) => setValue(val)}
                    >
                        <Tab component={Link} to="/movies" label="Movies" />
                        {!isUserLoggedIn && (
                            <Tab component={Link} to="/auth" label="Login" />
                        )}
                        {isUserLoggedIn && (
                            <>
                                <Tab component={Link} to="/user" label="Profile" />
                                <Tab
                                    onClick={logout}
                                    component={Link}
                                    to="/"
                                    label="Logout"
                                />
                            </>
                        )}
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
