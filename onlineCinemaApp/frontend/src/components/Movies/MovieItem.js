import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';
import { Link } from "react-router-dom";

const MovieItem = ({ title, releaseDate, posterUrl, id }) => {
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
                position: 'relative',  // Makes sure the absolute positioning of title/button works
                overflow: 'hidden',
                '&:hover': {
                    boxShadow: '10px 10px 20px #ccc',
                    // Make title and button box visible on hover
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
                        borderRadius: '5px 5px 0 0', // Rounded top corners
                    }}
                />
            </CardContent>

            {/* Title and Button Section */}
            <Box
                className="overlay"  // Add a class to target this element
                sx={{
                    position: 'absolute',
                    bottom: 0, // Position it at the bottom of the card
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for the bottom section
                    color: '#fff',
                    visibility: 'hidden',  // Initially hidden
                    opacity: 0, // Hidden by default
                    transition: 'visibility 0s, opacity 0.3s ease', // Smooth transition for opacity
                    padding: 2,
                    textAlign: 'center',
                    zIndex: 1, // Ensures it's above the image
                }}
            >
                <Typography variant="h6" component="div" sx={{ marginBottom: '8px' }}>
                    {title}
                </Typography>
                <Button variant="contained"
                    fullWidth
                    LinkComponent={Link}
                    to={`/booking/${id}`}
                    sx={{
                    margin: "auto",
                    bgcolor: "#2b2d42",
                    ":hover": {
                        bgcolor: "#121217",
                        },
                    }}
                    size="small"
                >Book</Button>
            </Box>
        </Card>
    );
};

export default MovieItem;