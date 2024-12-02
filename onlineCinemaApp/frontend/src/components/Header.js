import React, { useEffect, useState } from 'react';
import { AppBar, Autocomplete, Tab, TextField, Tabs, Toolbar } from '@mui/material';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import { Box } from '@mui/system';
import { getAllMovies } from '../api-helpers/api-helpers';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminActions, userActions } from '../store';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
    const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const [value, setValue] = useState(0);
    const [movies, setMovies] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        getAllMovies()
            .then((data) => setMovies(data.movies))
            .catch((err) => console.log(err));
    }, []);

    // Logout function based on user/admin role
    const logout = (isAdmin) => {
        dispatch(isAdmin ? adminActions.logout() : userActions.logout());
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
        <AppBar position="sticky" sx={{ bgcolor: "#211134" }}>
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
                                sx={{ input: { color: "#white" } }}
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
                        indicatorColor="inherit"
                        value={value}
                        onChange={(e, val) => setValue(val)}
                    >
                        {/* Update Tab with dynamic rendering */}
                        <Tab component={Link} to="/movies" label="Movies" />
                        {(!isAdminLoggedIn && !isUserLoggedIn) && (
                            <>
                                <Tab component={Link} to="/admin" label="Admin" />
                                <Tab component={Link} to="/auth" label="Login" />
                            </>
                        )}
                        {isUserLoggedIn && (
                            <>
                                <Tab component={Link} to="/user" label="Profile" />
                                <Tab
                                    onClick={() => logout(false)}
                                    component={Link}
                                    to="/"
                                    label="Logout"
                                />
                            </>
                        )}
                        {isAdminLoggedIn && (
                            <>
                                <Tab component={Link} to="/add" label="Add Movie" />
                                <Tab component={Link} to="/user-admin" label="Profile" />
                                <Tab
                                    onClick={() => logout(true)}
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
