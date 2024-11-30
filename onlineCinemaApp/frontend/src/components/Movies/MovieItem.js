import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';

const MovieItem = ({title,releaseDate,posterUrl,id}) => {
    return (
        <Card
            sx={{
                maxWidth: 250,
                height: 320,
                borderRadius: 5,
                boxShadow: '3px 3px 15px rgba(0, 0, 0, 0.1)', // Add shadow for better visibility
                display: 'flex',
                flexDirection: 'column', // Ensures the content inside the card is stacked vertically
                justifyContent: 'space-between', // Ensure content is spaced evenly
                margin: 2, // Ensures spacing around each card
                transition: 'box-shadow 0.3s ease', // Smooth transition for hover effect
                '&:hover': {
                    boxShadow: '10px 10px 20px #ccc',
                },
            }}
        >
            <img height={'50%'} width={'100%'} src={posterUrl} alt={title} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(releaseDate).toDateString()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button sx={{ margin: 'auto' }} size="small">Book</Button>
            </CardActions>
        </Card>
    );
};

export default MovieItem;
