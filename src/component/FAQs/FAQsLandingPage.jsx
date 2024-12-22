import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import Lottie from 'react-lottie';
import forParentsAnimation from './for_parents_guardians.json';
import forBabysittersAnimation from './for_babysitters.json';

const FAQsLandingPage = () => {
    const boxes = [
        {
            title: 'For Parents/Guardians',
            href: '/faqs/parents',
            animation: forParentsAnimation,
        },
        {
            title: 'For Babysitters',
            href: '/faqs/babysitters',
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
            }}
        >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
                Frequently Asked Questions
            </Typography>
            <Grid container spacing={4} justifyContent="space-evenly">
                {boxes.map((box, index) => (
                    <Grid item xs={12} sm={5} key={index}>
                        <Link href={box.href} underline="none">
                            <Box
                                sx={{
                                    height: 350,
                                    width: '100%',
                                    maxWidth: 500,
                                    backgroundColor: '#fff',
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'flex-start', // Align content to the top
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                    paddingTop: '10px', // Add some padding from the top
                                }}
                            >
                                {/* Lottie Animation */}
                                <Lottie
                                    options={{
                                        loop: true,
                                        autoplay: true,
                                        animationData: box.animation,
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
                                        color: '#333', // Dark text for contrast
                                    }}
                                >
                                    {box.title}
                                </Typography>
                            </Box>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FAQsLandingPage;
