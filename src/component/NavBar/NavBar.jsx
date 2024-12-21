import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

function NavBar() {
    return (
        <AppBar position="static" color="default" sx={{ bgcolor: '#ffffff' }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Box component="img" src="../../images/Babysitters_logo.jpg" sx={{ height: 50 }} alt="Babysitters Logo" />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                        Babysitters
                    </Typography>
                </Box>
                <Button color="inherit" component={RouterLink} to="/">Home</Button>
                <Button color="inherit" component={RouterLink} to="/about">About</Button>
                <Button color="inherit" component={RouterLink} to="/services">Services</Button>
                <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
