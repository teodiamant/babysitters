import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Box, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '../../images/teo_logo.jpg';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    name: user.displayName || user.email.split('@')[0], // Default to part of the email if name is not available
                    photoURL: user.photoURL || "path/to/default/photo.jpg"
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe(); // Ensure we clean up the listener
    }, [auth]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // Redirect to home on logout
    };

    const handleProfileClick = () => {
        navigate('/profile'); // Adjust this path based on your routing setup
    };

    const navLinks = ['Home', 'About', 'Services', 'Contact'];

    return (
        <AppBar position="static" sx={{ bgcolor: '#d5caac' }}>
            <Toolbar>
                <IconButton
                    component={RouterLink}
                    to="/"
                    sx={{ height: 70, width: 70, p: 0, disableRipple: true }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: '100%', width: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                </IconButton>

                <Typography
                    component={RouterLink}
                    to="/"
                    sx={{ ml: -1, fontFamily: "'Pacifico', cursive", fontSize: '1.5rem', color: '#4c3b34', textDecoration: 'none' }}
                >
                    Babysitters
                </Typography>

                <Box sx={{ display: 'flex', ml: 'auto', gap: 2 }}>
                    {navLinks.map((label) => (
                        <Button
                            key={label}
                            component={RouterLink}
                            to={`/${label.toLowerCase()}`}
                            sx={{ color: '#004951', '&:hover': { color: '#003d43' }, textTransform: 'capitalize' }}
                        >
                            {label}
                        </Button>
                    ))}
                </Box>

                {user ? (
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={user.photoURL} sx={{ width: 30, height: 30 }} onClick={handleProfileClick} />
                        <Typography sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={handleProfileClick}>
                            {user.name}
                        </Typography>
                        <Button onClick={handleLogout} color="inherit">Logout</Button>
                    </Box>
                ) : (
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="contained"
                            sx={{ color: 'white', bgcolor: '#f3b2ac', '&:hover': { bgcolor: '#bba0ee' } }}
                        >
                            Sign In
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            sx={{ color: 'white', bgcolor: '#795e53', '&:hover': { bgcolor: '#4c3b34' } }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                )}

                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <List sx={{ width: 250 }}>
                    {[...navLinks, 'Sign In', 'Sign Up'].map((label) => (
                        <ListItem
                            button
                            key={label}
                            component={RouterLink}
                            to={`/${label.toLowerCase().replace(' ', '')}`}
                            onClick={() => setDrawerOpen(false)}
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
