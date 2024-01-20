import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Error500: React.FC = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Typography variant="h4" gutterBottom>
                Error 500: Internal Server Error
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
                Oops! Something went wrong on our end. Please try again later.
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
                Go to Home
            </Button>
        </Box>
    );
};

export default Error500;
