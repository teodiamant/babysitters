import React, { useState } from 'react';
import { AppBar, Typography, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
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

    // Navigation Links
    const navLinks = ['Home', 'About', 'Services', 'Contact', 'Sign In', 'Sign Up'];

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
                {/* Babysitters.com Text */}
                <Typography
                    component={RouterLink}
                    to="/"
                    sx={{
                        ml: -1, // Adjust margin to move it to the right of the logo
                        fontFamily: "'Pacifico', cursive", // Apply the Pacifico font
                        fontSize: '1.5rem', // Adjust font size
                        color: '#4c3b34', // Text color
                        textDecoration: 'none', // Remove underline
                    }}
                >
                    Babysitters
                </Typography>
                {/* Navigation Buttons for Larger Screens */}
                <div className="nav-buttons" sx={{ display: { xs: 'none', sm: 'block' }, ml: 'auto' }}>
                    {navLinks.map((label) => (
                        <Button
                            key={label}
                            variant={['Sign In', 'Sign Up'].includes(label) ? 'contained' : 'outlined'} // Standout Sign In and Sign Up buttons
                            color={label === 'Sign Up' ? 'primary' : label === 'Sign In' ? 'secondary' : 'inherit'}
                            component={RouterLink}
                            to={`/${label.toLowerCase().replace(' ', '')}`}
                            sx={{
                                mx: 1, // Margin between buttons
                                color:
                                    label === 'Sign Up'
                                        ? 'white' // Button text color for Sign Up
                                        : label === 'Sign In'
                                        ? 'white' // Button text color for Sign In
                                        : '#004951',
                                bgcolor:
                                    label === 'Sign In'
                                        ? '#f3b2ac' // Background color for Sign In
                                        : label === 'Sign Up'
                                        ? '#795e53' // Background color for Sign Up
                                        : 'transparent',
                                borderColor: '#004951',
                                '&:hover': {
                                    backgroundColor:
                                        label === 'Sign Up'
                                            ? '#4c3b34' // Hover background for Sign Up
                                            : label === 'Sign In'
                                            ? '#e76052' // Hover background for Sign In
                                            : '#d5caac',
                                    borderColor: '#004951',
                                    color: label === 'Sign Up' || label === 'Sign In' ? 'white' : '#004951',
                                },
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
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
                    {navLinks.map((label) => (
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
