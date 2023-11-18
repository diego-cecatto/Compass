import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

const NotFoundPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h1">404</Typography>
            <Typography variant="h4">Page Not Found</Typography>
            <Typography variant="body1">
                The page you are looking for does not exist.
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
                Go to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;
