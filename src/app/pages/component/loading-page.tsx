import React from 'react';
import { Grid, Skeleton } from '@mui/material';

export const LoadingPage = () => {
    return (
        <Grid container spacing={2}>
            <LoadingSection />
            <LoadingSection variant="small" />
            <LoadingSection />
            <LoadingSection variant="small" />
        </Grid>
    );
};

const LoadingSection = ({
    variant = 'large',
}: {
    variant?: 'small' | 'large';
}) => {
    return (
        <>
            <Grid item xs={12} sx={{ height: 50 }}>
                <Skeleton width={200} height="100%" />
            </Grid>
            <Grid item xs={12} sx={{ height: variant == 'large' ? 400 : 200 }}>
                <Skeleton height="100%" sx={{ transform: 'scale(1, 1)' }} />
            </Grid>
        </>
    );
};
