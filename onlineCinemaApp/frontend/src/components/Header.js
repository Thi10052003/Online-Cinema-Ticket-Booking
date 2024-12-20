import React, { useEffect, useState } from 'react';
import { AppBar, Autocomplete, Tab, TextField, Tabs, Toolbar, Typography, Button } from '@mui/material';
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
        navigate('/'); // Redirect to home after logout
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
        <AppBar
            position="sticky"
            sx={{
                background: "black",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
                padding: "0 20px",
            }}
        >
            <Toolbar>
                <Box display="flex" alignItems="center" width="20%">
                    <Link to="/">
                        <MovieCreationIcon
                            sx={{
                                color: "rgb(255, 50, 80)",
                                cursor: "pointer",
                                fontSize: "2rem",
                                textShadow: "0px 0px 10px rgba(255, 50, 80, 0.8)"
                            }}
                        />
                    </Link>
                    <Typography
                        variant="h6"
                        sx={{
                            color: "rgb(255, 50, 80)",
                            marginLeft: "10px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            textShadow: "0px 0px 10px rgba(255, 50, 80, 0.8)"
                        }}
                    >
                        PrismReel
                    </Typography>
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
                                variant="outlined"
                                sx={{
                                    input: { color: "white" },
                                    background: "#333",
                                    borderRadius: "5px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#555",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#f50057",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#f50057",
                                        },
                                    },
                                }}
                            />
                        )}
                    />
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Tabs
                        textColor="inherit"
                        indicatorColor="inherit"
                        value={value}
                        onChange={(_, val) => setValue(val)}
                    >
                        <Tab
                            component={Link}
                            to="/movies"
                            label="Movies"
                            sx={{
                                color: "#fff",
                                fontWeight: value === 0 ? "bold" : "normal",
                            }}
                        />
                        {isUserLoggedIn && (
                            <Tab
                                component={Link}
                                to="/user"
                                label="Profile"
                                sx={{
                                    color: "#fff",
                                    fontWeight: value === 2 ? "bold" : "normal",
                                }}
                            />
                        )}
                    </Tabs>
                    {!isUserLoggedIn ? (
                        <Button
                            component={Link}
                            to="/auth"
                            variant="contained"
                            sx={{
                                background: "red",
                                color: "#fff",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                "&:hover": {
                                    background: "darkred",
                                },
                            }}
                        >
                            Login
                        </Button>
                    ) : (
                        <Button
                            onClick={logout}
                            variant="contained"
                            sx={{
                                background: "red",
                                color: "#fff",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                "&:hover": {
                                    background: "darkred",
                                },
                            }}
                        >
                            Logout
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
