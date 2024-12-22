import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';
import logo from '../../images/teo_logo.jpg';

const Footer = () => (
    <Box
        component="footer"
        sx={{
            bgcolor: '#d5caac', // Matches navbar background
            px: 4,
            py: 2, // Compact padding similar to the navbar
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }}
    >
        <Grid container spacing={4} alignItems="center">
            {/* Left Compartment: Logo, Email, and Contact Us */}
            <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {/* Logo */}
                    <Link href="/" underline="none" sx={{ display: 'inline-block', mb: 1.5 }}>
                        <Box
                            component="img"
                            src={logo}
                            sx={{
                                height: 70, // Matches navbar logo size
                                width: 120,
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    </Link>
                    {/* Company Name */}
                    <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{
                            fontFamily: "'Pacifico', cursive", // Apply the Pacifico font
                            fontSize: '1.5rem', // Adjust font size
                            color: '#4c3b34', // Text color
                            textDecoration: 'none', // Remove underline
                        }}
                    >
                        <Link href="/" underline="none" sx={{ color: 'inherit', "&:hover": { color: '#004951' } }}>
                            Babysitters
                        </Link>
                    </Typography>
                    {/* Email */}
                    <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                            fontSize: '0.9rem',
                            mb: 0.3,
                        }}
                    >
                        Email: <Link href="mailto:info@babysitters.com" sx={{ color: '#004951' }}>info@babysitters.com</Link>
                    </Typography>
                    {/* Contact Us */}
                    <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{
                            fontSize: '0.9rem',
                        }}
                    >
                        Contact Us: <strong>+0030 6969696969</strong>
                    </Typography>
                </Box>
            </Grid>

            {/* Middle Compartment: More Information */}
            <Grid item xs={12} md={4}>
                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight="bold"
                    sx={{ fontSize: '1.2rem', mb: 1 }}
                >
                    More Information
                </Typography>
                {["What is Babysitters.com", "Sign up as Babysitter", "Sign up as Guardian", "Partners", "FAQs"].map(
                    (text, index) => (
                        <Typography
                            key={index}
                            variant="body2"
                            sx={{
                                mb: 0.8,
                                color: 'black',
                                transition: 'all 0.3s',
                                "&:hover": {
                                    fontWeight: 'bold',
                                    color: '#004951',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            <Link
                                href={text === "FAQs" ? "/faqs" : "#"} // Link only FAQs to the FAQ page
                                underline="none"
                                sx={{ color: 'inherit' }}
                            >
                                {text}
                            </Link>
                        </Typography>
                    )
                )}
            </Grid>

            {/* Right Compartment: Information */}
            <Grid item xs={12} md={4}>
                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight="bold"
                    sx={{ fontSize: '1.2rem', mb: 1 }}
                >
                    Information
                </Typography>
                {[
                    "Frequently Asked Questions",
                    "Specifications for Services",
                    "Terms and Conditions",
                    "Contact",
                ].map((text, index) => (
                    <Typography
                        key={index}
                        variant="body2"
                        sx={{
                            mb: 0.8,
                            color: 'black',
                            transition: 'all 0.3s',
                            "&:hover": {
                                fontWeight: 'bold',
                                color: '#004951',
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        <Link href="#" underline="none" sx={{ color: 'inherit' }}>
                            {text}
                        </Link>
                    </Typography>
                ))}
            </Grid>
        </Grid>
    </Box>
);

export default Footer;
