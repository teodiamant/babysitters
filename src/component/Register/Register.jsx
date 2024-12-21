import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Link } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { FIREBASE_AUTH } from '../../config/firebase';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function SignUp(event) {
        event.preventDefault();
        setLoading(true);

        // Basic client-side validation
        if (!email || !password) {
            alert('Please fill in all fields.');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            alert('Password should be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const res = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            console.log('User registered:', res.user);
            alert('Registration successful! Redirecting to homepage.');
            navigate('/'); // Navigate to homepage on success
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('This email is already registered.');
                    break;
                case 'auth/invalid-email':
                    alert('Please enter a valid email address.');
                    break;
                case 'auth/weak-password':
                    alert('Password should be at least 6 characters long.');
                    break;
                default:
                    alert('Failed to register. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={SignUp} noValidate sx={{ mt: 1 }}>
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
                        disabled={loading}
                        aria-label="Email Address"
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
                        disabled={loading}
                        aria-label="Password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: '#004951',
                            '&:hover': {
                                bgcolor: '#003d43',
                            },
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login" sx={{ fontWeight: 'bold' }}>
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
