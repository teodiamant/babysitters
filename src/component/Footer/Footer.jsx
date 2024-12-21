import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import logo from '../../images/Babysittres_logo.jpg';  // Ensure the path is correct

function Footer() {
    return (
        <Box
            sx={{
                py: 2,
                px: 2,
                mt: 'auto',
                backgroundColor: '#f5f5f5',  // Change background color to white
                width: '100%',
                position: 'fixed',
                bottom: 0,
                left: 0,
                boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
                borderTop: '3px solid #004951',  // Assuming the logo color is this blue
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
            component="footer"
        >
            <Box component="img" src={logo} sx={{ height: 80, marginLeft: 2 }} />  
            <Container maxWidth="lg">
                <Typography variant="body1" align="center" gutterBottom>
                    Your Company Name
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    © 2023 Your Company. All rights reserved.
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    Contact Us: <Link color="inherit" href="mailto:email@example.com">email@example.com</Link>
                </Typography>
            </Container>
        </Box>
    );
}

export default Footer;




