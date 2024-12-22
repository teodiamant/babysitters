import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';
import logo from '../../images/teo_logo.jpg';

const Footer = () => (
    <Box
        component="footer"
        sx={{
            bgcolor: '#d5caac',
            px: 4,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }}
    >
        <Grid container spacing={4} alignItems="center">
            {/* Left Compartment: Logo, Email, and Contact Us */}
            <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Link href="/" underline="none" sx={{ display: 'inline-block', mb: 1.5 }}>
                        <Box
                            component="img"
                            src={logo}
                            sx={{
                                height: 70,
                                width: 120,
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    </Link>
                    <Typography
                        variant="h6"
                        color="text.primary"
                        sx={{
                            fontFamily: "'Pacifico', cursive",
                            fontSize: '1.5rem',
                            color: '#4c3b34',
                            textDecoration: 'none',
                        }}
                    >
                        <Link href="/" underline="none" sx={{ color: 'inherit', "&:hover": { color: '#004951' } }}>
                            Babysitters
                        </Link>
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.9rem', mb: 0.3 }}>
                        Email: <Link href="mailto:info@babysitters.com" sx={{ color: '#004951' }}>info@babysitters.com</Link>
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.9rem' }}>
                        Contact Us: <strong>+0030 6969696969</strong>
                    </Typography>
                </Box>
            </Grid>

            {/* Middle Compartment: About */}
            <Grid item xs={12} md={4}>
                <Typography
                    variant="subtitle1"
                    color="text.primary"
                    fontWeight="bold"
                    sx={{ fontSize: '1.2rem', mb: 1 }}
                >
                    About
                </Typography>
                {[
                    { text: "What is Babysitters?", href: "/about" },
                    { text: "Sign up as a Babysitter", href: "/signup-babysitter" },
                    { text: "Sign up as a Parent/Guardian", href: "/signup-parent" },
                ].map((item, index) => (
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
                        <Link href={item.href} underline="none" sx={{ color: 'inherit' }}>
                            {item.text}
                        </Link>
                    </Typography>
                ))}
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
                    { text: "FAQs", href: "/faqs" },
                    { text: "Specifications for Services", href: "/specifications" },
                    { text: "Terms and Conditions", href: "/terms" },
                ].map((item, index) => (
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
                        <Link href={item.href} underline="none" sx={{ color: 'inherit' }}>
                            {item.text}
                        </Link>
                    </Typography>
                ))}
            </Grid>
        </Grid>
    </Box>
);

export default Footer;
