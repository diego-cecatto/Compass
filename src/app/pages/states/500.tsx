import React from 'react';
import { Typography, Button, Box } from '@mui/material';

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
            <Button variant="contained" color="primary">
                Go Back
            </Button>
        </Box>
    );
};

export default Error500;
