import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import Lottie from 'react-lottie';
import forParentsAnimation from './for_parents_guardians.json';
import forBabysittersAnimation from './for_babysitters.json';

const SignUpLandingPage = () => {
    const options = [
        {
            title: 'Sign Up as Parent/Guardian',
            href: '/signup-parent',
            animation: forParentsAnimation,
        },
        {
            title: 'Sign Up as Babysitter',
            href: '/signup-babysitter',
            animation: forBabysittersAnimation,
        },
    ];

    return (
        <Box
            sx={{
                px: 4,
                py: 6,
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
                display: 'flex',
                //margin: -2.5,
                paddingTop: '50px',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                How would you like to sign up?
            </Typography>
            <Grid
                container
                spacing={4}
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    maxWidth: 900, // Set a max width for the grid
                    margin: '0 auto', // Center the grid horizontally
                }}
            >
                {options.map((option, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Link href={option.href} underline="none">
                            <Box
                                sx={{
                                    height: 350,
                                    width: '100%',
                                    maxWidth: 400,
                                    backgroundColor: '#fff',
                                    borderRadius: 2,
                                    border: '1px solid #795e53',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                    paddingTop: '10px',
                                }}
                            >
                                {/* Lottie Animation */}
                                <Lottie
                                    options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: option.animation,
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 0,
                                    }}
                                />
                                {/* Text */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        position: 'relative',
                                        zIndex: 1,
                                        color: '#333',
                                    }}
                                >
                                    {option.title}
                                </Typography>
                            </Box>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SignUpLandingPage;
