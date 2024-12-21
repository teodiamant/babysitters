import React from 'react';
import { AppBar, Toolbar, IconButton, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../../images/Babysittres_logo.jpg';

function NavBar() {
    return (
        <AppBar position="static" color="default" sx={{ bgcolor: '#f5f5f5' }}>
            <Toolbar>
            <IconButton component={RouterLink} to="/" sx={{ marginRight: 'auto', height: '50px' }}>
                    <img src={logo} alt="Logo" style={{ height: '100%' }} />
                </IconButton>
                <Button color="inherit" component={RouterLink} to="/">Home</Button>
                <Button color="inherit" component={RouterLink} to="/about">About</Button>
                <Button color="inherit" component={RouterLink} to="/services">Services</Button>
                <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
                <Button color="inherit" component={RouterLink} to="/login">Sign In</Button>
                <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;

