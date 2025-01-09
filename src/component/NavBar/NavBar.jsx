import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Box, Avatar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../config/firebase'; 
import logo from '../../images/teo_logo.jpg';

const NavBar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userEmail = firebaseUser.email;
                    console.log("Firebase user email:", userEmail);
    
                    // Query the 'users' collection to get the user's role
                    const usersQuery = query(
                        collection(FIREBASE_DB, 'users'),
                        where('email', '==', userEmail)
                    );
                    const usersSnapshot = await getDocs(usersQuery);
    
                    if (!usersSnapshot.empty) {
                        const userDoc = usersSnapshot.docs[0];
                        const userData = userDoc.data();
                        console.log("Fetched user data:", userData);
    
                        const role = userData.role; // Get the user's role
    
                        // Check the role and query the corresponding collection
                        if (role === 'parent') {
                            // Query the 'parents' collection
                            const parentQuery = query(
                                collection(FIREBASE_DB, 'parents'),
                                where('email', '==', userEmail)
                            );
                            const parentSnapshot = await getDocs(parentQuery);
    
                            if (!parentSnapshot.empty) {
                                const parentDoc = parentSnapshot.docs[0];
                                const parentData = parentDoc.data();
                                console.log("Fetched parent-specific data:", parentData);
    
                                setUser({
                                    id: userDoc.id,
                                    email: userEmail,
                                    name: parentData?.firstName,
                                    photoURL: parentData.profilePicture || "path/to/default/photo.jpg",
                                    role: role,
                                });
                            } else {
                                console.warn("No data found in 'parents' collection for this email.");
                            }
    
                        } else if (role === 'babysitter') {
                            // Query the 'babysitters' collection
                            const babysitterQuery = query(
                                collection(FIREBASE_DB, 'babysitters'),
                                where('email', '==', userEmail)
                            );
                            const babysitterSnapshot = await getDocs(babysitterQuery);
    
                            if (!babysitterSnapshot.empty) {
                                const babysitterDoc = babysitterSnapshot.docs[0];
                                const babysitterData = babysitterDoc.data();
                                console.log("Fetched babysitter-specific data:", babysitterData);
    
                                setUser({
                                    id: userDoc.id,
                                    email: userEmail,
                                    name: babysitterData.firstName,
                                    photoURL: babysitterData.profilePicture || "path/to/default/photo.jpg",
                                    role: role,
                                });
                            } else {
                                console.warn("No data found in 'babysitters' collection for this email.");
                            }
    
                        } else {
                            console.warn("No specific role found for this email.");
                            setUser(null); // Handle unknown roles by clearing the user state
                        }
                    } else {
                        console.warn("No user data found in 'users' collection for this email.");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.log("No user is signed in.");
                setUser(null);
            }
        });
    
        return () => unsubscribe();
    }, [auth]);
    
    

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); 
    };

    const handleProfileClick = () => {
        if (!user || !user.role|| !user.email) {
            console.warn("User or role is undefined:", user);
            return;
        }
    
        if (user.role === 'parent') {
            navigate(`/parent-profile/${user.email}`);
        } else if (user.role === 'babysitter') {
            navigate(`/babysitter-profile/${user.email}`);
        } else {
            console.warn("Unexpected user role:", user.role);
        }
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
        <Avatar
            src={user.photoURL || "path/to/default/photo.jpg"}
            sx={{ width: 30, height: 30 }}
            onClick={handleProfileClick}
        />
        <Typography
            sx={{
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
            }}
            onClick={handleProfileClick}
        >
            {user.name || "Unknown User"} 
        </Typography>
        <Button onClick={handleLogout} color="inherit">
            Logout
        </Button>
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
            to="/signup-landing"
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
