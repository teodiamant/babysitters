import React, { useState } from 'react';
import { AppBar, Typography, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../images/teo_logo.jpg';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Toggle Drawer
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Navigation Links (excluding Sign In/Sign Up)
    const navLinks = ['Home', 'About', 'Services', 'Contact'];

    return (
        <AppBar position="static" sx={{ bgcolor: '#d5caac' }}>
            <Toolbar>
                {/* Clickable Logo */}
                <IconButton
                    component={RouterLink}
                    to="/"
                    sx={{
                        height: 70,
                        width: 70,
                        p: 0,
                    }}
                    disableRipple
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            pointerEvents: 'none',
                        }}
                    />
                </IconButton>

                {/* Babysitters Text */}
                <Typography
                    component={RouterLink}
                    to="/"
                    sx={{
                        ml: -1,
                        fontFamily: "'Pacifico', cursive",
                        fontSize: '1.5rem',
                        color: '#4c3b34',
                        textDecoration: 'none',
                    }}
                >
                    Babysitters
                </Typography>

                {/* Navigation Links */}
                <Box sx={{ display: 'flex', ml: 'auto', gap: 2 }}>
                    {navLinks.map((label) => (
                        <Button
                            key={label}
                            component={RouterLink}
                            to={`/${label.toLowerCase()}`}
                            sx={{
                                color: '#004951',
                                '&:hover': { color: '#003d43' },
                                textTransform: 'capitalize',
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Box>

                {/* Sign In and Sign Up Buttons */}
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                    {/* Sign In */}
                    <Button
                        component={RouterLink}
                        to="/login"
                        variant="contained"
                        sx={{
                            color: 'white',
                            bgcolor: '#f3b2ac', // Background color for Sign In
                            '&:hover': { bgcolor: '#bba0ee' }, // Hover color for Sign In
                        }}
                    >
                        Sign In
                    </Button>
                    {/* Sign Up */}
                    <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        sx={{
                            color: 'white',
                            bgcolor: '#795e53', // Background color for Sign Up
                            '&:hover': { bgcolor: '#4c3b34' }, // Hover color for Sign Up
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>

                {/* Hamburger Menu for Smaller Screens */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            {/* Drawer for Small Screens */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <List sx={{ width: 250 }}>
                    {[...navLinks, 'Sign In', 'Sign Up'].map((label) => (
                        <ListItem
                            button
                            key={label}
                            component={RouterLink}
                            to={`/${label.toLowerCase().replace(' ', '')}`}
                            onClick={toggleDrawer(false)}
                        >
                            <ListItemText primary={label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </AppBar>
    );
};

export default NavBar;
