import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../config/firebase';
import { Button, TextField, CircularProgress, Box, Typography, Container, Link } from '@mui/material';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;

            console.log("User logged in:", user);

            // Fetch user role from Firestore
            const userQuery = query(
                collection(FIREBASE_DB, 'users'),
                where('email', '==', user.email)
            );
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();

                if (userData.role === 'babysitter') {
                    navigate('/babysitter-profile');
                } else if (userData.role === 'parent') {
                    navigate('/parent-profile');
                } else {
                    console.error("Unknown user role:", userData.role);
                }
            } else {
                console.error("No user data found in Firestore for this email.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
            if (currentUser) {
                try {
                    // Fetch user role from Firestore
                    const userQuery = query(
                        collection(FIREBASE_DB, 'users'),
                        where('email', '==', currentUser.email)
                    );
                    const userSnapshot = await getDocs(userQuery);

                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();

                        if (userData.role === 'babysitter') {
                            navigate('/babysitter-profile');
                        } else if (userData.role === 'parent') {
                            navigate('/parent-profile');
                        }
                    }
                } catch (error) {
                    console.error("Error checking user role:", error);
                }
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#ffffff'
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#004951', '&:hover': { bgcolor: '#003d43' } }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                    {error && <Typography color="error">{error}</Typography>}
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        If you are not signed up, {' '}
                        <Link component={RouterLink} to="/signup-landing" sx={{ fontWeight: 'bold' }}>
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
