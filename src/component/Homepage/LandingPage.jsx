import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import backgroundImage from './backgroundLandingPage1.jpg'; // Ensure correct relative path

const LandingPage = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/search'); // Redirect to search.jsx
    };

    return (
        <Box
            sx={{
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                textAlign: 'center',
                padding: '20px',
                border: '5px solid #795e53', // Add border
                borderRadius: '10px', // Rounded corners
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Optional shadow
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
                    padding: '20px',
                    borderRadius: '10px', // Rounded corners
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        mb: 4,
                        color: '#4c3b34',
                        fontFamily: "'Pacifico', cursive",
                    }}
                >
                    Welcome to Babysitters
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleButtonClick}
                    sx={{
                        backgroundColor: '#795e53',
                        color: '#fff',
                        fontSize: '1.2rem',
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: '#4c3b34',
                        },
                    }}
                >
                    Find a Babysitter
                </Button>
            </Box>
        </Box>
    );
};

export default LandingPage;
