import React from 'react';
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MovieItem = ({ title, releaseDate, posterUrl, id }) => {
    const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

    return (
        <Card
            sx={{
                maxWidth: 230,
                height: 330,
                borderRadius: 5,
                boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                margin: 2,
                transition: 'box-shadow 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    boxShadow: '10px 10px 20px #ccc',
                    '& .overlay': { 
                        visibility: 'visible',
                        opacity: 1,
                    },
                },
            }}
        >
            {/* Poster Section: Image Card */}
            <CardContent sx={{ padding: 0, flex: 1 }}>
                <img
                    src={posterUrl}
                    alt={title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '5px 5px 0 0',
                    }}
                />
            </CardContent>

            {/* Title and Button Section */}
            <Box
                className="overlay"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    visibility: 'hidden',
                    opacity: 0,
                    transition: 'visibility 0s, opacity 0.3s ease',
                    padding: 2,
                    textAlign: 'center',
                    zIndex: 1,
                }}
            >
                <Typography variant="h6" component="div" sx={{ marginBottom: '8px' }}>
                    {title}
                </Typography>
                <Button
                    variant="contained"
                    fullWidth
                    LinkComponent={Link}
                    to={isUserLoggedIn ? `/booking/${id}` : '/auth'}
                    sx={{
                        margin: "auto",
                        bgcolor: "#2b2d42",
                        ":hover": {
                            bgcolor: "#121217",
                        },
                    }}
                    size="small"
                >
                    {isUserLoggedIn ? "Book" : "Book"}
                </Button>
            </Box>
        </Card>
    );
};

export default MovieItem;
