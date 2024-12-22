// import React, { useState } from 'react';
// import { Container, Box, TextField, Button, Typography, CircularProgress, Link } from '@mui/material';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { useNavigate, Link as RouterLink } from 'react-router-dom';
// import { FIREBASE_AUTH } from '../../config/firebase';

// export default function Register() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     async function SignUp(event) {
//         event.preventDefault();
//         setLoading(true);

//         // Basic client-side validation
//         if (!email || !password) {
//             alert('Please fill in all fields.');
//             setLoading(false);
//             return;
//         }
//         if (password.length < 6) {
//             alert('Password should be at least 6 characters long.');
//             setLoading(false);
//             return;
//         }

//         try {
//             const res = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
//             console.log('User registered:', res.user);
//             alert('Registration successful! Redirecting to homepage.');
//             navigate('/'); // Navigate to homepage on success
//         } catch (error) {
//             switch (error.code) {
//                 case 'auth/email-already-in-use':
//                     alert('This email is already registered.');
//                     break;
//                 case 'auth/invalid-email':
//                     alert('Please enter a valid email address.');
//                     break;
//                 case 'auth/weak-password':
//                     alert('Password should be at least 6 characters long.');
//                     break;
//                 default:
//                     alert('Failed to register. Please try again later.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <Container component="main" maxWidth="xs">
//             <Box
//                 sx={{
//                     marginTop: 8,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                 }}
//             >
//                 <Typography component="h1" variant="h5">
//                     Register
//                 </Typography>
//                 <Box component="form" onSubmit={SignUp} noValidate sx={{ mt: 1 }}>
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         id="email"
//                         label="Email Address"
//                         name="email"
//                         autoComplete="email"
//                         autoFocus
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         disabled={loading}
//                         aria-label="Email Address"
//                     />
//                     <TextField
//                         margin="normal"
//                         required
//                         fullWidth
//                         name="password"
//                         label="Password"
//                         type="password"
//                         id="password"
//                         autoComplete="current-password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         disabled={loading}
//                         aria-label="Password"
//                     />
//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         color="primary"
//                         sx={{
//                             mt: 3,
//                             mb: 2,
//                             bgcolor: '#004951',
//                             '&:hover': {
//                                 bgcolor: '#003d43',
//                             },
//                         }}
//                         disabled={loading}
//                     >
//                         {loading ? <CircularProgress size={24} /> : 'Register'}
//                     </Button>
//                     <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
//                         Already have an account?{' '}
//                         <Link component={RouterLink} to="/login" sx={{ fontWeight: 'bold' }}>
//                             Sign in
//                         </Link>
//                     </Typography>
//                 </Box>
//             </Box>
//         </Container>
//     );
// }


import React, { useState } from 'react';
import { Container, TextField, Button, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../config/firebase';

export default function Register() {
    const [activeStep, setActiveStep] = useState(0);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        area: '',
        postalCode: '',
        amka: '',
        extraInfo: '',
        photo: null,
        document: null
    });

    const handleNext = () => {
        if (activeStep === 2) {
            handleSubmit();
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (files) {
            setUserData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        const { email, password } = userData;
        try {
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            console.log("Registration successful, user ID:", userCredential.user.uid);
            // Here you would redirect to profile or home page
            setActiveStep(0); // Reset stepper on successful registration
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const steps = ['Basic Information', 'Additional Information', 'Confirm & Submit'];

    return (
        <Container component="main" maxWidth="xs">
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <form onSubmit={e => e.preventDefault()}>
                {activeStep === 0 && (
                    <>
                        <TextField fullWidth label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} required />
                        <TextField fullWidth label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} required />
                        <TextField fullWidth label="Email" type="email" name="email" value={userData.email} onChange={handleChange} required />
                        <TextField fullWidth label="Password" type="password" name="password" value={userData.password} onChange={handleChange} required />
                        <TextField fullWidth label="Address" name="address" value={userData.address} onChange={handleChange} required />
                        <TextField fullWidth label="Area" name="area" value={userData.area} onChange={handleChange} required />
                        <TextField fullWidth label="Postal Code" name="postalCode" value={userData.postalCode} onChange={handleChange} required />
                        <TextField fullWidth label="AMKA" name="amka" value={userData.amka} onChange={handleChange} required />
                    </>
                )}
                {activeStep === 1 && (
                    <>
                        <TextField fullWidth label="Extra Information" name="extraInfo" value={userData.extraInfo} onChange={handleChange} multiline rows={4} />
                        <TextField fullWidth type="file" name="document" onChange={handleChange} inputProps={{ accept: "application/pdf" }} />
                        <TextField fullWidth type="file" name="photo" onChange={handleChange} inputProps={{ accept: "image/*" }} />
                    </>
                )}
                {activeStep === 2 && (
                    <Typography>
                        Confirm your details and submit to complete registration.
                    </Typography>
                )}
                <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                <Button variant="contained" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Confirm & Register' : 'Next'}
                </Button>
            </form>
        </Container>
    );
}


